import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';
import User from '../../db/models/user/user';
import { DEFAULT_INCLUDE_USER_ATTRS } from "../../db/models/constants";

const {Op} = db.Sequelize;

export async function shops(user, query, order, offset, limit) {
  const {search} = query;
  let where = {
    companyId: user.companyId
  };
  if (search && search.length) {
    where = {
      ...where,
      name: {
        [Op.like]: `%${search}%`
      }
    }
  }
  console.log('=====: ', where)
  return db.Shop.findAndCountAll({
    order,
    where,
    include: [
      {
        model: User, as: 'createdBy',
        attributes: DEFAULT_INCLUDE_USER_ATTRS
      }
    ],
    offset,
    limit
  });
}

export async function getShop(user, wId) {
  const shop = await db.Shop.findOne({
    where: {
      companyId: user.companyId,
      id: wId
    }
  });
  if (!shop) {
    throw badRequest('shop', FIELD_ERROR.INVALID, 'Shop not found');
  }
  return shop;
}

export async function createShop(user, createForm) {
  if (!user.companyId) {
    throw badRequest('companyId', FIELD_ERROR.INVALID, 'User have not company');
  }
  return db.Shop.create(
    {
      name: createForm.name.trim(),
      address: createForm.address.trim(),
      phone: createForm.phone ? createForm.phone.trim() : '',
      companyId: user.companyId,
      createdById: user.id,
      createdDate: new Date()
    }
  )
}

export async function updateShop(wId, user, updateForm) {
  const shop = await db.Shop.findByPk(wId);
  if (!shop) {
    throw badRequest('shop', FIELD_ERROR.INVALID, 'Shop not found');
  }
  shop.name = updateForm.name.trim();
  shop.address = updateForm.address.trim();
  shop.phone = updateForm.phone.trim();
  shop.lastModifiedDate = new Date();
  shop.lastModifiedById = user.id;
  return shop.save();
}

export async function removeShop(wId) {
  const shop = await db.Shop.findByPk(wId);
  if (!shop) {
    throw badRequest('shop', FIELD_ERROR.INVALID, 'Shop not found');
  }
  return db.Shop.destroy({
    where: {id: shop.id}
  });
}
