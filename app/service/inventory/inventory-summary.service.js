import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';
import User from '../../db/models/user/user';
import { DEFAULT_INCLUDE_USER_ATTRS } from "../../db/models/constants";

const {Op} = db.Sequelize;

export function inventorySummaries(search, order, offset, limit, user) {
  const where = {};

  if (search) {
    if (search.warehouseId) {
      where.warehouseId = search.warehouseId;
    }
    if (search.productId) {
      where.productId = search.productId;
    }
  }
  where.companyId = user.companyId;
  return db.InventorySummary.findAndCountAll({
    order,
    where,
    include: [
      {
        model: User, as: 'lastModifiedBy',
        attributes: DEFAULT_INCLUDE_USER_ATTRS
      },
      {model: db.WareHouse, as: 'warehouse', attributes: ['id', 'name', 'address']},
      {model: db.Product, as: 'product'},
      {
        model: db.ProductUnit, as: 'unit',
        where: {
          productId: {
            [Op.eq]: db.Sequelize.col('inventorySummary.productId')
          }
        }
      }
    ],
    offset,
    limit
  });
}


export async function getDetailInventorySummary(inventorySummaryId) {
  const checkInventorySummary = await db.InventorySummary.findOne({
    where: {
      id: inventorySummaryId
    },
    include: [
      {model: db.WareHouse, as: 'warehouse'},
      {model: db.Product, as: 'product'},
      {model: db.ProductUnit, as: 'unit'},
      {model: db.InventoryDetailSerial, as: 'serials'}
    ]
  });
  if (!checkInventorySummary) {
    throw badRequest('InventorySummary', FIELD_ERROR.INVALID, 'inventory summary not found');
  }
  return checkInventorySummary;
}
