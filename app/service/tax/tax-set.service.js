import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';
import User from '../../db/models/user/user';
import {hasText} from "../../util/string.util";

const {Op} = db.Sequelize;

export function listTaxSet(user, query, {order, offset, limit}) {
  const {search} = query;
  let where = {
    companyId: user.companyId
  };
  if (hasText(search)) {
    where = {
      ...where,
      name: {
        [Op.like]: `%${search}%`
      }
    }
  }
  return db.TaxSet.findAndCountAll({
    order,
    where,
    include: [
      {
        model: User, as: 'lastModifiedBy',
        attributes: ['id', 'displayName', 'email']
      }
    ],
    offset,
    limit
  });
}

export async function getTaxSet(user, wId) {
  const item = await db.TaxSet.findOne({
    where: {
      companyId: user.companyId,
      id: wId
    },
    include: [
      {model: db.Tax, as: 'taxes'}
    ]
  });
  if (!item) {
    throw badRequest('taxSet', FIELD_ERROR.INVALID, 'Tax Set not found');
  }
  return item;
}

export async function createTaxSet(user, createForm) {
  if (!user.companyId) {
    throw badRequest('companyId', FIELD_ERROR.INVALID, 'User have not company');
  }
  const {name, remark, taxes} = createForm;
  const transaction = await db.sequelize.transaction();
  try {
    const newTaxSet = await db.TaxSet.create({
      name,
      remark,
      numOfTax: taxes.length,
      companyId: user.companyId,
      lastModifiedById: user.id,
      lastModifiedDate: new Date()
    }, {transaction})
    await db.TaxSetDetail.bulkCreate(taxes.map(t => ({
      taxSetId: newTaxSet.id,
      taxId: t.id
    })), {transaction})
    await transaction.commit();
    return newTaxSet;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function updateTaxSet(user, wId, updateForm) {
  const item = await getTaxSet(user, wId);

  const {name, remark, taxes} = updateForm;
  const transaction = await db.sequelize.transaction();
  try {
    item.name = name;
    item.remark = remark;
    item.numOfTax = taxes.length;
    item.lastModifiedDate = new Date();
    item.lastModifiedById = user.id;
    await item.save({transaction});
    await db.TaxSetDetail.destroy({
      where: {
        taxSetId: wId
      }
    })
    await db.TaxSetDetail.bulkCreate(taxes.map(t => ({
      taxSetId: wId,
      taxId: t.id
    })), {transaction})
    await transaction.commit();
    return item;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function removeTaxSet(user, wId) {
  const item = await getTaxSet(user, wId);
  return item.destroy();
}
