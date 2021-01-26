import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';
import {createInventoryDetail, removeInventoryDetail} from './inventory-detail.service';

import {createInventoryPurpose, removeInventoryPurpose, updateInventoryPurpose} from './inventory-purpose.service';

import {unitBaseAndSumQuantity} from '../../event/inventory.event';
import User from '../../db/models/user/user';
import {INVENTORY_TYPE} from '../../db/models/inventory/inventory';
import {queueInventoryIn, queueInventoryOut} from "../../queue/inventory.queue";
import {updateItemTags} from "../tagging/tagging.service";
import { TAGGING_TYPE } from '../../db/models/tagging/tagging-item-type';

const {Op} = db.Sequelize;

const mapping = (item) => ({
  ...item,
  tagging: item.taggingItems.map(t => t.tagging)
})


export function inventories(query, order, offset, limit, user) {
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

    if (query.startDate && query.startDate.length
      && query.endDate && query.endDate.length) {
      const dateObjEndDate = new Date(query.endDate);
      dateObjEndDate.setHours(dateObjEndDate.getHours() + 24);
      where.processedDate = {
        [Op.lt]: dateObjEndDate,
        [Op.gte]: new Date(query.startDate)
      };
    } else if (query.endDate && query.endDate.length) {
      const dateObjEndDate = new Date(query.endDate);
      dateObjEndDate.setHours(dateObjEndDate.getHours() + 24);
      where.processedDate = {
        [Op.lt]: dateObjEndDate
      };
    } else if (query.startDate && query.startDate.length) {
      where.processedDate = {
        [Op.gte]: new Date(query.startDate)
      };
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
        attributes: ['id', 'displayName', 'email']
      },
      {
        model: User, as: 'lastModifiedBy',
        attributes: ['id', 'displayName', 'email']
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
    limit
  }).then(resp => ({...resp, rows: resp.rows.map(item => mapping(item.get({ plain: true })))}));;
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
    throw badRequest('inventory', FIELD_ERROR.INVALID, 'inventory not found');
  }

  return mapping(inventory.get({ plain: true }));
}

export async function createInventory(user, type, createForm) {
  if (INVENTORY_TYPE.OUT === type) {
    for (let i = 0; i < createForm.details.length; i += 1) {
      const item = createForm.details[i];
      // eslint-disable-next-line no-await-in-loop
      const {quantity} = await unitBaseAndSumQuantity(item.productId, item.unitId, item.quantity);
      // eslint-disable-next-line no-await-in-loop
      const checkInventorySummary = await db.InventorySummary.findOne({
        where: {
          productId: item.productId
        }
      });
      if (!checkInventorySummary) {
        throw badRequest('product', FIELD_ERROR.INVALID, 'product in inventory not found');
      }
      if (Number(quantity) > checkInventorySummary.quantity) {
        throw badRequest('product_quantity', FIELD_ERROR.INVALID, 'quantity of product more than inventory');
      }
    }
  }
  const transaction = await db.sequelize.transaction();
  try {
    const inventory = await db.Inventory.create({
      name: createForm.name,
      warehouseId: createForm.warehouseId,
      type: type,
      processedDate: createForm.processedDate,
      companyId: user.companyId,
      totalProduct: createForm.details.length,
      remark: createForm.remark,
      createdDate: new Date(),
      createdById: user.id
    }, {transaction});

    await createInventoryDetail(inventory.id, createForm.details, transaction);

    if (createForm.purposeId && createForm.purposeId.length && createForm.relativeId && createForm.relativeId.length) {
      await createInventoryPurpose(inventory.id, createForm.purposeId, createForm.relativeId, transaction);
    }
    if (createForm.tagging && createForm.tagging.length) {
      await updateItemTags({
        id: inventory.id,
        type: type === INVENTORY_TYPE.OUT ? TAGGING_TYPE.INVENTORY_GOOD_ISSUE : TAGGING_TYPE.INVENTORY_GOOD_RECEIPT,
        transaction,
        newTags: createForm.tagging
      })
    }

    await transaction.commit();
    queueInventoryIn(await getInventory(inventory.id, user));
    return inventory;
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    throw error;
  }
}

export async function updateInventory(inventoryId, user, type, updateForm) {
  const inventoryOld = await db.Inventory.findOne({
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

  if (!inventoryOld) {
    throw badRequest('inventory', FIELD_ERROR.INVALID, 'inventory not found');
  }

  const transaction = await db.sequelize.transaction();
  try {
    await inventoryOld.update({
      name: updateForm.name,
      warehouseId: updateForm.warehouseId,
      type: type,
      processedDate: updateForm.processedDate,
      companyId: user.companyId,
      totalProduct: updateForm.details.length,
      remark: updateForm.remark,
      lastModifiedDate: new Date(),
      lastModifiedById: user.id
    }, transaction);

    if (updateForm.details && updateForm.details.length) {
      // delete inventory detail old
      await removeInventoryDetail(inventoryOld.id, transaction);
      // create inventory detail
      await createInventoryDetail(inventoryOld.id, updateForm.details, transaction);
    }

    if (updateForm.purposeId && updateForm.purposeId.length && updateForm.relativeId && updateForm.relativeId.length) {
      await updateInventoryPurpose(inventoryOld.id, updateForm.purposeId, updateForm.relativeId, transaction);
    }

    if (updateForm.tagging && updateForm.tagging.length) {
      await updateItemTags({
        id: inventoryId,
        type: type === INVENTORY_TYPE.OUT ? TAGGING_TYPE.INVENTORY_GOOD_ISSUE : TAGGING_TYPE.INVENTORY_GOOD_RECEIPT,
        transaction,
        newTags: updateForm.tagging
      })
    }

    await transaction.commit();
    const inventoryNew = await getInventory(inventoryId, user);
    await queueInventoryOut(inventoryOld);
    await queueInventoryIn(inventoryNew);
    return inventoryNew;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function removeInventory(inventoryId, user) {
  const existedInventory = await getInventory(inventoryId, user);
  if (!existedInventory) {
    throw badRequest('inventory', FIELD_ERROR.INVALID, 'inventory not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    // delete inventory detail
    await removeInventoryDetail(existedInventory.id, transaction);
    await removeInventoryPurpose(existedInventory.id, transaction);
    const inventory = db.Inventory.destroy({
      where: {id: existedInventory.id, companyId: user.companyId}
    }, {transaction});
    await transaction.commit();

    queueInventoryOut(existedInventory);
    return inventory;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
