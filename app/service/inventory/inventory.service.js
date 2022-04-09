import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';
import User from '../../db/models/user/user';
import {taggingMapping} from "../tagging/tagging.service";
import {TAGGING_TYPE} from '../../db/models/tagging/tagging-item-type';
import {buildDateRangeQuery} from "../../util/db.util";
import { DEFAULT_INCLUDE_USER_ATTRS } from "../../db/models/constants";

const {Op} = db.Sequelize;

export function inventories(user, query, {order, offset, limit}) {
  const where = {};
  if (query) {
    if (query.search && query.search.length) {
      where.name = {
        [Op.like]: `%${query.search}%`
      };
    }
    if (query.warehouseId) {
      where.warehouseId = query.warehouseId;
    }
    const dateQuery = buildDateRangeQuery(query.startDate, query.endDate);
    if (dateQuery != null) {
      where.createdDate = dateQuery;
    }

  }
  where.companyId = user.companyId;
  return db.Inventory.findAndCountAll({
    order,
    where,
    include: [
      {model: db.InventoryDetail, as: 'details'},
      {
        model: User, as: 'createdBy',
        attributes: DEFAULT_INCLUDE_USER_ATTRS
      },
      {
        model: User, as: 'lastModifiedBy',
        attributes: DEFAULT_INCLUDE_USER_ATTRS
      },
      {model: db.WareHouse, as: 'warehouse', attributes: ['id', 'name', 'address']},
      {
        model: db.TaggingItem, as: 'taggingItems',
        required: false,
        where: {
          itemType: {
            [Op.in]: [TAGGING_TYPE.INVENTORY_GOOD_ISSUE, TAGGING_TYPE.INVENTORY_GOOD_RECEIPT]
          }
        },
        include: [
          {model: db.Tagging, as: 'tagging'}
        ]
      }
    ],
    offset,
    limit,
    group: ['id']
  }).then((resp) => {
    return ({
      count: resp.count.length,
      rows: resp.rows.map(item => taggingMapping(item.get({plain: true})))
    });
  });
}

export async function getInventory(inventoryId, user) {
  const inventory = await db.Inventory.findOne({
    where: {
      [Op.and]: [
        {id: inventoryId},
        {companyId: user.companyId}
      ]
    }, include: [
      {model: db.WareHouse, as: 'warehouse'},
      {
        model: db.InventoryDetail, as: 'details',
        include: [
          {model: db.Product, as: 'product', attributes: ['id', 'name', 'remark']},
          {
            model: db.ProductUnit, as: 'unit',
            required: false,
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
            [Op.in]: [TAGGING_TYPE.INVENTORY_GOOD_ISSUE, TAGGING_TYPE.INVENTORY_GOOD_RECEIPT]
          }
        },
        include: [
          {model: db.Tagging, as: 'tagging'}
        ]
      }
    ]
  });
  if (!inventory) {
    throw badRequest('inventory', FIELD_ERROR.INVALID, 'Inventory not found');
  }

  return taggingMapping(inventory.get({plain: true}));
}
