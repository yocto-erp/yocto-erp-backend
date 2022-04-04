import db from '../../db/models';

import { createOrderDetail, removeOrderDetail } from './order-detail.service';
import { badRequest, FIELD_ERROR } from '../../config/error';
import User from '../../db/models/user/user';
import { TAGGING_TYPE } from '../../db/models/tagging/tagging-item-type';
import { updateItemTags } from '../tagging/tagging.service';
import { ORDER_TYPE } from '../../db/models/order/order';
import { hasText } from '../../util/string.util';
import { beginningDateStr, endDateStr } from '../../util/date.util';

const { Op } = db.Sequelize;

export function sumTotalProduct(orderDetailsForm) {
  return orderDetailsForm.reduce((valOld, valNew) => valOld + (valNew.quantity * valNew.price), 0);
}

const mapping = (item) => ({
  ...item,
  tagging: item.taggingItems.map(t => t.tagging)
});


export function orders(type, search, order, offset, limit, user) {
  const where = { type };
  console.log(search);
  if (search) {
    if (search.search && search.search.length) {
      where.name = {
        [Op.like]: `%${search.search}%`
      };
    }
    if (search.company && search.company.id) {
      where.partnerCompanyId = search.company.id;
    }
    if (search.customer && search.customer.id) {
      where.partnerPersonId = search.customer.id;
    }
    if (hasText(search.startDate) && hasText(search.endDate)) {
      where.processedDate = {
        [Op.lte]: endDateStr(search.endDate),
        [Op.gte]: beginningDateStr(search.startDate)
      };
    } else if (hasText(search.endDate)) {
      where.processedDate = {
        [Op.lte]: endDateStr(search.endDate)
      };
    } else if (hasText(search.startDate)) {
      where.processedDate = {
        [Op.gte]: beginningDateStr(search.startDate)
      };
    }
  }
  where.companyId = user.companyId;
  return db.Order.findAndCountAll({
    order,
    include: [
      {
        model: User, as: 'createdBy',
        attributes: ['id', 'displayName', 'email']
      }, {
        model: User, as: 'lastModifiedBy',
        attributes: ['id', 'displayName', 'email']
      },
      { model: db.Company, as: 'partnerCompany', attributes: ['id', 'name'] },
      { model: db.Person, as: 'partnerPerson', attributes: ['id', 'firstName', 'lastName', 'fullName'] },
      {
        model: db.TaggingItem, as: 'taggingItems',
        required: false,
        where: {
          itemType: {
            [Op.in]: [TAGGING_TYPE.SALE_ORDER, TAGGING_TYPE.PURCHASE_ORDER]
          }
        },
        include: [
          { model: db.Tagging, as: 'tagging' }
        ]
      }
    ],
    where,
    offset,
    limit
  }).then(resp => ({ ...resp, rows: resp.rows.map(item => mapping(item.get({ plain: true }))) }));
}

export async function getOrder(oId, user) {
  const order = await db.Order.findOne({
    where: {
      [Op.and]: [
        { id: oId },
        { companyId: user.companyId }
      ]
    },
    include: [
      { model: db.Person, as: 'partnerPerson', attributes: ['id', 'firstName', 'lastName', 'name', 'email'] },
      { model: db.Company, as: 'partnerCompany', attributes: ['id', 'name', 'address', 'gsm'] },
      {
        model: db.OrderDetail, as: 'details',
        include: [
          { model: db.Product, as: 'product', attributes: ['id', 'name', 'remark'] },
          {
            model: db.ProductUnit, as: 'unit',
            where: {
              productId: {
                [Op.eq]: db.Sequelize.col('details.productId')
              }
            }
          }
        ]
      },
      {
        model: db.TaggingItem, as: 'taggingItems',
        required: false,
        where: {
          itemType: {
            [Op.in]: [TAGGING_TYPE.SALE_ORDER, TAGGING_TYPE.PURCHASE_ORDER]
          }
        },
        include: [
          { model: db.Tagging, as: 'tagging' }
        ]
      }
    ]
  });
  if (!order) {
    throw badRequest('order', FIELD_ERROR.INVALID, 'order not found');
  }
  return mapping(order.get({ plain: true }));
}

export async function createOrder(user, type, createForm) {
  const transaction = await db.sequelize.transaction();
  try {
    const totalAmount = await sumTotalProduct(createForm.details);
    const order = await db.Order.create({
      name: createForm.name,
      remark: createForm.remark,
      partnerCompanyId: createForm.partnerCompanyId,
      partnerPersonId: createForm.partnerPersonId,
      createdById: user.id,
      companyId: user.companyId,
      processedDate: new Date(),
      type: type,
      totalAmount: totalAmount,
      createdDate: new Date()
    }, { transaction });

    if (createForm.details && createForm.details.length) {
      await createOrderDetail(order.id, createForm.details, transaction);
    }

    if (createForm.partnerCompanyId && createForm.partnerPersonId) {
      await db.PartnerCompanyPerson.findOrCreate({
        where: {
          partnerCompanyId: createForm.partnerCompanyId,
          personId: createForm.partnerPersonId
        },
        defaults: {
          partnerCompanyId: createForm.partnerCompanyId,
          personId: createForm.partnerPersonId
        },
        transaction
      });
    }
    if (createForm.tagging && createForm.tagging.length) {
      await updateItemTags({
        id: order.id,
        type: type === ORDER_TYPE.PURCHASE ? TAGGING_TYPE.PURCHASE_ORDER : TAGGING_TYPE.SALE_ORDER,
        transaction,
        newTags: createForm.tagging
      });
    }
    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function updateOrder(oId, user, type, updateForm) {
  const existedOrder = await db.Order.findOne({
    where: {
      [Op.and]: [
        { id: oId },
        { companyId: user.companyId }
      ]
    }
  });
  if (!existedOrder) {
    throw badRequest('order', FIELD_ERROR.INVALID, 'order not found');
  }
  const transaction = await db.sequelize.transaction();
  try {

    const totalAmount = await sumTotalProduct(updateForm.details);

    await existedOrder.update({
      name: updateForm.name,
      remark: updateForm.remark,
      partnerCompanyId: updateForm.partnerCompanyId,
      partnerPersonId: updateForm.partnerPersonId,
      companyId: user.companyId,
      processedDate: new Date(),
      type: type,
      totalAmount: totalAmount,
      lastModifiedDate: new Date(),
      lastModifiedById: user.id
    }, transaction);

    if (updateForm.partnerCompanyId && updateForm.partnerPersonId) {
      await db.PartnerCompanyPerson.findOrCreate({
        where: {
          partnerCompanyId: updateForm.partnerCompanyId,
          personId: updateForm.partnerPersonId
        },
        defaults: {
          partnerCompanyId: updateForm.partnerCompanyId,
          personId: updateForm.partnerPersonId
        },
        transaction
      });
    }
    if (updateForm.details && updateForm.details.length) {
      await removeOrderDetail(existedOrder.id, transaction);
      await createOrderDetail(existedOrder.id, updateForm.details, transaction);
    }
    if (updateForm.tagging && updateForm.tagging.length) {
      await updateItemTags({
        id: oId,
        type: type === ORDER_TYPE.PURCHASE ? TAGGING_TYPE.PURCHASE_ORDER : TAGGING_TYPE.SALE_ORDER,
        transaction,
        newTags: updateForm.tagging
      });
    }
    await transaction.commit();
    return existedOrder;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

}

export async function removeOrder(oId, user) {
  const checkOrder = await db.Order.findOne({
    where: {
      [Op.and]: [
        { id: oId },
        { companyId: user.companyId }
      ]
    }
  });
  if (!checkOrder) {
    throw badRequest('order', FIELD_ERROR.INVALID, 'order not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    await removeOrderDetail(checkOrder.id, transaction);
    const order = db.Order.destroy({
      where: { id: checkOrder.id }
    }, { transaction });
    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
