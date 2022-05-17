import db from "../../db/models";
import { updateItemTags } from "../tagging/tagging.service";
import { ORDER_TYPE } from "../../db/models/order/order";
import { TAGGING_TYPE } from "../../db/models/tagging/tagging-item-type";
import { auditAction } from "../audit/audit.service";
import { PERMISSION } from "../../db/models/acl/acl-action";
import { addTaggingQueue } from "../../queue/tagging.queue";
import { getOrder, sumTotalProduct } from "./order.service";
import { getCurrentUserShop } from "../user/member.service";
import { isArrayHasLength } from "../../util/func.util";
import { isUserHasAnyPermission } from "../../controller/middleware/permission";

export async function createPurchaseOrder(user, createForm, tracking) {
  const transaction = await db.sequelize.transaction();

  try {
    const totalAmount = await sumTotalProduct(createForm.details);
    const newOrderObj = {
      name: createForm.name,
      remark: createForm.remark,
      subjectId: createForm.subject?.id,
      createdById: user.id,
      companyId: user.companyId,
      processedDate: new Date(),
      type: ORDER_TYPE.PURCHASE,
      status: createForm.status,
      totalAmount: totalAmount,
      createdDate: new Date()
    };
    // If user have permission to set shop, get shop from frontend
    if (isUserHasAnyPermission(user, PERMISSION.ORDER.PURCHASE.SHOP)) {
      newOrderObj.shopId = createForm.shop?.id;
    } else {
      // TODO: In future, we can have more option for automatically set user shop
      const currentUserShop = await getCurrentUserShop(user);
      newOrderObj.shopId = currentUserShop?.id;
    }
    const order = await db.Order.create(newOrderObj, { transaction });

    await db.OrderDetail.bulkCreate(createForm.details.map((result, index) => {
      return {
        orderDetailId: index + 1,
        orderId: order.id,
        productId: result.product.id,
        productUnitId: result.unit.id,
        quantity: result.quantity,
        remark: result.remark,
        price: result.price
      };
    }), { transaction });

    if (createForm.tagging && createForm.tagging.length) {
      await updateItemTags({
        id: order.id,
        type: TAGGING_TYPE.PURCHASE_ORDER,
        transaction,
        newTags: createForm.tagging
      });
    }
    await transaction.commit();

    auditAction({
      actionId: PERMISSION.ORDER.PURCHASE.CREATE,
      user, name: createForm.name, remark: createForm.remark,
      relativeId: String(order.id), subject: createForm.subject, tracking
    }).then();
    if (createForm.tagging && createForm.tagging.length) {
      addTaggingQueue([...new Set(createForm.tagging.map(t => t.id))]);
    }
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function updatePurchaseOrder(oId, user, updateForm, tracking) {
  const existedOrder = await getOrder(oId, user);

  const transaction = await db.sequelize.transaction();
  try {
    const totalAmount = await sumTotalProduct(updateForm.details);
    existedOrder.name = updateForm.name;
    existedOrder.remark = updateForm.remark;
    existedOrder.subjectId = updateForm.subject?.id;
    existedOrder.companyId = user.companyId;
    existedOrder.type = ORDER_TYPE.PURCHASE;
    existedOrder.status = updateForm.status;
    existedOrder.totalAmount = totalAmount;
    existedOrder.lastModifiedDate = new Date();
    existedOrder.lastModifiedById = user.id;

    console.log(user.permissions);
    if (isUserHasAnyPermission(user, PERMISSION.ORDER.PURCHASE.SHOP)) {
      // TODO: IN case update, we only care about shop from frontend, no need get default shop from user.
      existedOrder.shopId = updateForm.shop?.id;
    }
    await existedOrder.save({
      transaction
    });

    await db.OrderDetail.destroy(
      {
        where: {
          orderId: existedOrder.id
        }
      }, { transaction }
    );
    if (isArrayHasLength(updateForm.details)) {
      await db.OrderDetail.bulkCreate(updateForm.details.map((result, index) => {
        return {
          orderDetailId: index + 1,
          orderId: existedOrder.id,
          productId: result.product.id,
          productUnitId: result.unit.id,
          quantity: result.quantity,
          remark: result.remark,
          price: result.price
        };
      }), { transaction });
    }
    let listUpdateTags = [];
    if (isArrayHasLength(updateForm.tagging) || isArrayHasLength(existedOrder.tagging)) {
      await updateItemTags({
        id: existedOrder.id,
        type: TAGGING_TYPE.PURCHASE_ORDER,
        transaction,
        newTags: updateForm.tagging
      });

      listUpdateTags = [...new Set([...((updateForm.tagging || []).map(t => t.id)),
        ...((existedOrder.tagging || []).map(t => t.id))])];
    }
    await transaction.commit();

    auditAction({
      actionId: PERMISSION.ORDER.PURCHASE.UPDATE,
      user, subject: updateForm.subject,
      name: updateForm.name, remark: updateForm.remark,
      relativeId: String(oId), tracking
    }).then();
    if (listUpdateTags.length) {
      addTaggingQueue(listUpdateTags);
    }

    return existedOrder;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

}
