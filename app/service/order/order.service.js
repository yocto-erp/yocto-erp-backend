import db from "../../db/models";
import { badRequest, FIELD_ERROR } from "../../config/error";
import { TAGGING_TYPE } from "../../db/models/tagging/tagging-item-type";
import { updateItemTags } from "../tagging/tagging.service";
import { ORDER_TYPE } from "../../db/models/order/order";
import { hasText } from "../../util/string.util";
import { buildDateTimezoneRangeQuery } from "../../util/db.util";
import { auditAction } from "../audit/audit.service";
import { PERMISSION } from "../../db/models/acl/acl-action";
import { addTaggingQueue } from "../../queue/tagging.queue";

const { Op } = db.Sequelize;

export function sumTotalProduct(orderDetailsForm) {
  return orderDetailsForm.reduce((valOld, valNew) => valOld + (valNew.quantity * valNew.price), 0);
}

export function orders(type, { search, shop, subject, startDate, endDate }, { order, offset, limit }, user) {
  const where = { type };

  if (hasText(search)) {
    where.name = {
      [Op.like]: `%${search}%`
    };
  }
  if (subject) {
    where.subjectId = subject.id;
  }
  if (shop) {
    where.shopId = shop.id;
  }

  if (hasText(startDate) && hasText(endDate)) {
    const rangeDate = buildDateTimezoneRangeQuery(startDate, endDate);
    if (rangeDate != null) {
      where.createdDate = rangeDate;
    }
  }

  where.companyId = user.companyId;
  return db.Order.scope("search").findAndCountAll({
    order,
    include: [
      {
        model: db.Tagging, as: "tagging",
        required: false
      },
      {
        model: db.Shop, as: "shop"
      }
    ],
    where,
    offset,
    limit,
    group: ["id"]
  }).then((resp) => {
    return ({
      count: resp.count.length,
      rows: resp.rows
    });
  });
}

export async function getOrder(oId, user) {
  const order = await db.Order.scope("search").findOne({
    where: {
      id: oId,
      companyId: user.companyId
    },
    include: [
      {
        model: db.OrderDetail, as: "details",
        include: [
          { model: db.Product, as: "product", attributes: ["id", "name", "remark"] },
          {
            model: db.ProductUnit, as: "unit",
            where: {
              productId: {
                [Op.eq]: db.Sequelize.col("details.productId")
              }
            }
          }
        ]
      },
      { model: db.Tagging, as: "tagging", required: false }
    ]
  });
  if (!order) {
    throw badRequest("order", FIELD_ERROR.INVALID, "order not found");
  }
  return order;
}

export async function createOrder(user, type, createForm) {
  const transaction = await db.sequelize.transaction();
  try {
    const totalAmount = await sumTotalProduct(createForm.details);
    const order = await db.Order.create({
      name: createForm.name,
      remark: createForm.remark,
      subjectId: createForm.subject?.id,
      createdById: user.id,
      companyId: user.companyId,
      processedDate: new Date(),
      type: type,
      totalAmount: totalAmount,
      createdDate: new Date()
    }, { transaction });

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
        type: type === ORDER_TYPE.PURCHASE ? TAGGING_TYPE.PURCHASE_ORDER : TAGGING_TYPE.SALE_ORDER,
        transaction,
        newTags: createForm.tagging
      });
    }
    await transaction.commit();

    auditAction({
      actionId: PERMISSION.ORDER.PURCHASE.CREATE,
      user, partnerPersonId: createForm.partnerPersonId, partnerCompanyId: createForm.partnerCompanyId,
      relativeId: String(order.id), subject: createForm.subject
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

export async function updateOrder(oId, user, type, updateForm) {
  const existedOrder = await getOrder(oId, user);

  const transaction = await db.sequelize.transaction();
  try {
    const totalAmount = await sumTotalProduct(updateForm.details);

    await existedOrder.update({
      name: updateForm.name,
      remark: updateForm.remark,
      subjectId: updateForm.subject?.id,
      companyId: user.companyId,
      type: type,
      totalAmount: totalAmount,
      lastModifiedDate: new Date(),
      lastModifiedById: user.id
    }, { transaction });

    if (updateForm.details && updateForm.details.length) {
      await db.OrderDetail.destroy(
        {
          where: {
            orderId: existedOrder.id
          }
        }, { transaction }
      );
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
    if ((updateForm.tagging && updateForm.tagging.length) || (existedOrder.tagging && existedOrder.tagging.length)) {
      await updateItemTags({
        id: existedOrder.id,
        type: type === ORDER_TYPE.PURCHASE ? TAGGING_TYPE.PURCHASE_ORDER : TAGGING_TYPE.SALE_ORDER,
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
      relativeId: String(oId)
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

export async function removeOrder(oId, user) {
  const checkOrder = await getOrder(oId, user);
  try {
    await checkOrder.destroy();

    if (checkOrder.tagging && checkOrder.tagging.length) {
      addTaggingQueue([...new Set(checkOrder.tagging.map(t => t.id))]);
    }
    return checkOrder;
  } catch (error) {
    throw error;
  }
}
