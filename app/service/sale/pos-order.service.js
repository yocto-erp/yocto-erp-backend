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
    .filter(p => p.enableWarehouse)
    .map(t => {
      return {
        productId: t.productId,
        unitId: t.unitId,
        quantity: t.qty,
        product: t.product
      };
    });
  const listInventoryUpdate = mergeListUpdateInventory(checkProducts, null);
  await updateInventory(user.companyId, warehouseId, user.id, listInventoryUpdate, transaction);
  return checkProducts;
}

/* eslint-disable no-unused-vars */
export async function posOrder(user, posId, form, userAgent, ip) {
  console.log("posOrder", form);
  const userPos = await getUserPos(user, posId);
  const {
    products,
    id: clientId,
    name,
    customer,
    totalWithTax,
    tax,
    isShipping,
    debt,
    remark,
    return: returnValue,
    paymentAmount,
    voucher: {
      storeDebt,
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
  const transaction = await db.sequelize.transaction();
  let warehouseProducts = null;
  try {
    if (storeWarehouse) {
      // Check value in inventory is value
      warehouseProducts = await checkValidAndUpdateInventory(user, userPos.pos.warehouseId, products, transaction);
    }
    const order = await db.Order.create({
      name,
      remark,
      subjectId: customer?.id,
      createdById: user.id,
      companyId: user.companyId,
      processedDate: new Date(),
      type: ORDER_TYPE.SALE,
      totalAmount: totalWithTax,
      taxAmount: tax,
      createdDate: new Date(),
      shopId: "",
      paymentStatus: paymentAmount >= totalWithTax ? ORDER_PAYMENT_STATUS.PAID : ORDER_PAYMENT_STATUS.PENDING,
      status: isShipping ? ORDER_STATUS.SHIPPING : ORDER_STATUS.DONE,
      source: ORDER_SOURCE.POS,
      ip
    }, { transaction });

    const orderDetails = [];
    const orderDetailTaxes = [];
    const ecommerceDetails = [];
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
        orderDetailTaxes.push({
          orderDetailId: i + 1,
          orderId: order.id,
          taxId: taxItem.id,
          amount: taxItem.taxAmount
        });
      }
    }

    await db.OrderDetail.bulkCreate(orderDetails, { transaction });
    await db.OrderDetailTax.bulkCreate(orderDetailTaxes, { transaction });
    await db.EcommerceOrderDetail.bulkCreate(ecommerceDetails, { transaction });
    const ecommerceOrder = await db.EcommerceOrder.create({
      orderId: order.id,
      customerOrderId: clientId,
      remark,
      userAgent,
      confirmedDate: new Date(),
      isConfirmed: true,
      userPayAmount: paymentAmount
    });

    if (storeWarehouse && warehouseProducts && warehouseProducts.length) {
      const newInventoryOut = await createInventory(user, INVENTORY_TYPE.OUT, {
        details: warehouseProducts, warehouseId: userPos.pos.warehouseId,
        name: storeWarehouseName, remark, purposeId: INVENTORY_PURPOSE.SALE,
        relativeId: ecommerceOrder.id, tagging: storeWarehouseTagging
      }, transaction);
    }
    if (storeCashIn) {
      const newCost = await storeCost(user, {
        name: storeCashInName,
        remark,
        type: COST_TYPE.PAYMENT,
        subject: customer,
        amount: storeCashInAmount,
        purposeId: COST_PURPOSE.SALE,
        relativeId: ecommerceOrder.id,
        tagging: storeCashInTagging
      }, transaction);
    }
    // eslint-disable-next-line no-empty
    if (storeDebt) {

    }

    await transaction.commit();
    auditAction({
      actionId: PERMISSION.POS.ORDER,
      user, subject: customer,
      relativeId: String(order.id)
    }).then();
    return ecommerceOrder;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}
