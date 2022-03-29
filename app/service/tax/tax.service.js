import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';
import User from '../../db/models/user/user';
import {hasText} from "../../util/string.util";

const {Op} = db.Sequelize;

export function listTax(user, query, {order, offset, limit}) {
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
  return db.Tax.findAndCountAll({
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

export async function getTax(user, wId) {
  const item = await db.Tax.findOne({
    where: {
      companyId: user.companyId,
      id: wId
    }
  });
  if (!item) {
    throw badRequest('tax', FIELD_ERROR.INVALID, 'Tax not found');
  }
  return item;
}

export function createTax(user, createForm) {
  if (!user.companyId) {
    throw badRequest('companyId', FIELD_ERROR.INVALID, 'User have not company');
  }
  return db.Tax.create({
    name: createForm.name,
    shortName: createForm.shortName,
    remark: createForm.remark,
    type: createForm.type,
    amount: createForm.amount,
    companyId: user.companyId,
    lastModifiedById: user.id,
    lastModifiedDate: new Date()
  })
}

export async function updateTax(user, wId, updateForm) {
  const item = await getTax(user, wId);

  item.name = updateForm.name;
  item.shortName = updateForm.shortName;
  item.type = updateForm.type;
  item.amount = updateForm.amount;
  item.remark = updateForm.remark;
  item.lastModifiedDate = new Date();
  item.lastModifiedById = user.id;
  return item.save();
}

export async function removeTax(user, wId) {
  const item = await getTax(user, wId);
  return item.destroy();
}
