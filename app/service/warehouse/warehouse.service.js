import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';
import User from '../../db/models/user/user';
import { DEFAULT_INCLUDE_USER_ATTRS } from "../../db/models/constants";

const {Op} = db.Sequelize;

export function warehouses(user, query, order, offset, limit) {
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
  return db.WareHouse.findAndCountAll({
    order,
    where,
    include: [
      {
        model: User, as: 'createdBy',
        attributes: DEFAULT_INCLUDE_USER_ATTRS
      }, {
        model: User, as: 'lastModifiedBy',
        attributes: DEFAULT_INCLUDE_USER_ATTRS
      }
    ],
    offset,
    limit
  });
}

export async function getWarehouse(user, wId) {
  const warehouse = await db.WareHouse.findOne({
    where: {
      companyId: user.companyId,
      id: wId
    }
  });
  if (!warehouse) {
    throw badRequest('warehouse', FIELD_ERROR.INVALID, 'warehouse not found');
  }
  return warehouse;
}

export function createWarehouse(user, createForm) {
  if (!user.companyId) {
    throw badRequest('companyId', FIELD_ERROR.INVALID, 'User have not company');
  }
  return db.WareHouse.create(
    {
      name: createForm.name.trim(),
      address: createForm.address.trim(),
      companyId: user.companyId,
      createdById: user.id,
      createdDate: new Date()
    }
  )
}

export async function updateWarehouse(wId, user, updateForm) {
  const warehouse = await db.WareHouse.findByPk(wId);
  if (!warehouse) {
    throw badRequest('warehouse', FIELD_ERROR.INVALID, 'Warehouse not found');
  }
  warehouse.name = updateForm.name.trim();
  warehouse.address = updateForm.address.trim();
  warehouse.lastModifiedDate = new Date();
  warehouse.lastModifiedById = user.id;
  return warehouse.save();
}

export async function removeWarehouse(wId) {
  const warehouse = await db.WareHouse.findByPk(wId);
  if (!warehouse) {
    throw badRequest('warehouse', FIELD_ERROR.INVALID, 'Warehouse not found');
  }
  return db.WareHouse.destroy({
    where: {id: warehouse.id}
  });
}
