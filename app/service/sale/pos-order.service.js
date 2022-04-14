import db from "../../db/models";
import { badRequest, FIELD_ERROR } from "../../config/error";
import { ORDER_PAYMENT_STATUS, ORDER_SOURCE, ORDER_STATUS, ORDER_TYPE } from "../../db/models/order/order";
import { mergeListUpdateInventory, updateInventory } from "../inventory/inventory-in.service";
import { createInventory } from "../inventory/inventory-out.service";
import { INVENTORY_PURPOSE, INVENTORY_TYPE } from "../../db/models/inventory/inventory";
import { auditAction } from "../audit/audit.service";
import { PERMISSION } from "../../db/models/acl/acl-action";
import { storeCost } from "../cost/cost.service";
import { COST_TYPE } from "../../db/models/cost/cost";
import { COST_PURPOSE } from "../../db/models/cost/cost-purpose";
import { storeDebt } from "../debt/debt.service";
import { DEBT_TYPE } from "../../db/models/debt/debt";
import { DEBT_PURPOSE_TYPE } from "../../db/models/debt/debt-detail";
import { addTaggingQueue } from "../../queue/tagging.queue";
import { compare, formatNumberDB, fromBigNumberJson, toBigNumber } from "../../util/math.util";

export async function getUserPos(user, posId) {
  const item = await db.PosUser.findOne({
    where: {
      posId, userId: user.id
    },
    include: [
      { model: db.POS, as: "pos" }
    ]
  });
  if (!item) {
    throw badRequest("POS", FIELD_ERROR.INVALID, "User have no permission to access pos");
  }
  return item;
}

async function checkValidAndUpdateInventory(user, warehouseId, products, transaction) {
  const checkProducts = products
    .filter(p => p.product.enableWarehouse)
    .map(t => {
      return {
        productId: t.product.productId,
        unitId: t.product.unitId,
        quantity: t.qty,
        product: t.product.product
      };
    });
  const listInventoryUpdate = mergeListUpdateInventory(checkProducts, null);
  await updateInventory(user.companyId, warehouseId, user.id, listInventoryUpdate, transaction);
  return checkProducts;
}

/* eslint-disable no-unused-vars */
export async function posOrder(user, posId, form, userAgent, ip) {
  const userPos = await getUserPos(user, posId);
  const {
    order: {
      products,
      id: clientId,
      name,
      customer,
      isShipping,
      debt,
      remark
    },
    voucher: {
      storeDebt: isStoreDebt,
      storeDebtAmount,
      storeDebtName,
      storeDebtTagging,
      storeWarehouse,
      storeWarehouseName,
      storeWarehouseTagging,
      storeCashIn,
      storeCashInAmount,
      storeCashInName,
      storeCashInTagging
    }
  } = form;
  const totalWithTax = fromBigNumberJson(form.order.totalWithTax);
  const tax = fromBigNumberJson(form.order.tax);
  const paymentAmount = toBigNumber(form.order.paymentAmount);
  const transaction = await db.sequelize.transaction();
  let warehouseProducts = null;
  try {
    if (storeWarehouse) {
      // Check value in inventory is value
      warehouseProducts = await checkValidAndUpdateInventory(user, userPos.pos.warehouseId, products, transaction);
      console.log("Check Valid warehouse product", warehouseProducts);
    }
    const order = await db.Order.create({
      name,
      remark,
      subjectId: customer?.id,
      createdById: user.id,
      companyId: user.companyId,
      processedDate: new Date(),
      type: ORDER_TYPE.SALE,
      totalAmount: formatNumberDB(totalWithTax),
      taxAmount: formatNumberDB(tax),
      createdDate: new Date(),
      shopId: userPos.pos.shopId,
      paymentStatus: compare(paymentAmount, totalWithTax) > 0 ? ORDER_PAYMENT_STATUS.PAID : ORDER_PAYMENT_STATUS.PENDING,
      status: isShipping ? ORDER_STATUS.SHIPPING : ORDER_STATUS.DONE,
      source: ORDER_SOURCE.POS,
      ip
    }, { transaction });

    const orderDetails = [];
    const orderDetailTaxes = [];
    const ecommerceDetails = [];
    let listUpdateTags = [];
    for (let i = 0; i < products.length; i += 1) {
      const { product, qty, taxes: productTaxes, price, id } = products[i];
      orderDetails.push({
        orderDetailId: i + 1,
        orderId: order.id,
        productId: product.id,
        productUnitId: product.unitId,
        quantity: qty,
        price
      });
      ecommerceDetails.push({
        ecommerceOrderId: order.id,
        detailId: i + 1,
        ecommerceProductId: id
      });
      for (let j = 0; j < productTaxes.length; j += 1) {
        const taxItem = productTaxes[j];
        const taxAmount = fromBigNumberJson(taxItem.taxAmount);
        orderDetailTaxes.push({
          orderDetailId: i + 1,
          orderId: order.id,
          taxId: taxItem.id,
          amount: formatNumberDB(taxAmount)
        });
      }
    }

    await db.OrderDetail.bulkCreate(orderDetails, { transaction });
    await db.OrderDetailTax.bulkCreate(orderDetailTaxes, { transaction });
    const ecommerceOrder = await db.EcommerceOrder.create({
      orderId: order.id,
      customerOrderId: clientId,
      remark,
      userAgent,
      confirmedDate: new Date(),
      isConfirmed: true,
      userPayAmount: formatNumberDB(paymentAmount)
    }, { transaction });
    await db.EcommerceOrderDetail.bulkCreate(ecommerceDetails, { transaction });

    if (storeWarehouse && warehouseProducts && warehouseProducts.length) {
      const newInventoryOut = await createInventory(user, INVENTORY_TYPE.OUT, {
        details: warehouseProducts, warehouseId: userPos.pos.warehouseId,
        name: storeWarehouseName, remark, purposeId: INVENTORY_PURPOSE.SALE,
        relativeId: order.id, tagging: storeWarehouseTagging
      }, transaction);
      listUpdateTags = [...new Set(storeWarehouseTagging.map(t => t.id))];
    }
    if (storeCashIn) {
      const newCost = await storeCost(user, {
        name: storeCashInName,
        remark,
        type: COST_TYPE.RECEIPT,
        subject: customer,
        amount: storeCashInAmount,
        purposeId: COST_PURPOSE.SALE,
        relativeId: order.id,
        tagging: storeCashInTagging
      }, transaction);
      listUpdateTags = [...new Set([...listUpdateTags, ...storeCashInTagging.map(t => t.id)])];
    }
    // eslint-disable-next-line no-empty
    if (isStoreDebt) {
      const newDebt = await storeDebt(user, {
        name: storeDebtName,
        type: DEBT_TYPE.RECEIVABLES,
        subject: customer,
        amount: storeDebtAmount,
        tagging: storeDebtTagging,
        relateId: order.id,
        purposeType: DEBT_PURPOSE_TYPE.SALE
      }, transaction);
      listUpdateTags = [...new Set([...listUpdateTags, ...storeDebtTagging.map(t => t.id)])];
    }

    await transaction.commit();
    auditAction({
      actionId: PERMISSION.POS.ORDER,
      user, subject: customer,
      relativeId: String(order.id)
    }).then();
    if (listUpdateTags.length) {
      addTaggingQueue(listUpdateTags);
    }
    return ecommerceOrder;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}
