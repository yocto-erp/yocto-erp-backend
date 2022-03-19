import db from '../../db/models';
import {createCostPurpose, removeCostPurpose, updateCostPurpose} from './cost-purpose.service';
import {badRequest, FIELD_ERROR} from '../../config/error';
import {createCostAsset, mergeAssets, removeCostAssets, updateCostAssets} from '../asset/asset.service';
import User from '../../db/models/user/user';
import {updateItemTags} from '../tagging/tagging.service';
import {TAGGING_TYPE} from '../../db/models/tagging/tagging-item-type';
import {COST_TYPE} from '../../db/models/cost/cost';
import {auditAction} from '../audit/audit.service';
import {PERMISSION} from '../../db/models/acl/acl-action';
import {addTaggingQueue} from '../../queue/tagging.queue';
import {hasText} from '../../util/string.util';
import {beginningDateStr, endDateStr} from '../../util/date.util';
import {isGt0} from '../../util/number.util';
import {isArray} from '../../util/func.util';

const {Op} = db.Sequelize;

const mapping = (item) => ({
  ...item,
  tagging: item.taggingItems.map(t => t.tagging)
});

function getCostTagging(costId) {
  return db.TaggingItem.findAll({
    where: {
      itemId: costId,
      itemType: {
        [Op.in]: [TAGGING_TYPE.PAYMENT_VOUCHER, TAGGING_TYPE.RECEIPT_VOUCHER]
      }
    },
    include: [{model: db.Tagging, as: 'tagging'}]
  }).then((list) => list.map((t) => t.tagging));
}

export async function costs(query, order, offset, limit, user) {
  const {tagging, search, partnerCompany, partnerPerson, startDate, endDate, type} = query;
  const where = {companyId: user.companyId};
  const whereTagging = {
    itemType: {
      [Op.in]: [TAGGING_TYPE.PAYMENT_VOUCHER, TAGGING_TYPE.RECEIPT_VOUCHER]
    }
  };
  let isTaggingRequired = false;
  if (hasText(search)) {
    where.name = {
      [Op.like]: `%${search}%`
    };
  }
  if (partnerCompany && partnerCompany.id) {
    where.partnerCompanyId = partnerCompany.id;
  }
  if (partnerPerson && partnerPerson.id) {
    where.partnerPersonId = partnerPerson.id;
  }
  if (hasText(startDate) && hasText(endDate)) {
    const dateObjEndDate = endDateStr(endDate);
    where.processedDate = {
      [Op.lte]: dateObjEndDate,
      [Op.gte]: beginningDateStr(startDate)
    };
  } else if (hasText(endDate)) {
    where.processedDate = {
      [Op.lte]: endDateStr(endDate)
    };
  } else if (hasText(startDate)) {
    where.processedDate = {
      [Op.gte]: beginningDateStr(startDate)
    };
  }
  if (isGt0(type)) {
    where.type = type;
  }
  if (tagging && tagging.id) {
    whereTagging.taggingId = {
      [Op.in]: isArray(tagging.id) ? tagging.id : [tagging.id]
    };
    isTaggingRequired = true;
  }
  return db.Cost.findAndCountAll({
    order,
    where,
    include: [
      {
        model: User, as: 'createdBy',
        attributes: ['id', 'displayName', 'email']
      },
      {model: db.Person, as: 'partnerPerson', attributes: ['id', 'firstName', 'lastName', 'name']},
      {model: db.PaymentMethodSetting, as: 'paymentMethod'},
      {model: db.Company, as: 'partnerCompany', attributes: ['id', 'name']},
      {
        model: db.TaggingItem, as: 'taggingItems',
        required: isTaggingRequired,
        where: whereTagging
      }
    ],
    offset,
    limit,
    group: ['id']
  }).then(async (resp) => {
    const newRows = [];
    for (let i = 0; i < resp.rows.length; i += 1) {
      const item = resp.rows[i];
      newRows.push({
        ...item.get({plain: true}),
        // eslint-disable-next-line no-await-in-loop
        tagging: await getCostTagging(item.id)
      });
    }
    return ({
      count: resp.count.length,
      rows: newRows
    });
  });
}

export async function createCost(user, createForm) {
  const transaction = await db.sequelize.transaction();

  try {
    const cost = await db.Cost.create({
      name: createForm.name,
      remark: createForm.remark,
      companyId: user.companyId,
      type: createForm.type,
      paymentMethodId: createForm.paymentMethod?.id,
      partnerCompanyId: createForm.partnerCompanyId,
      partnerPersonId: createForm.partnerPersonId,
      processedDate: new Date(),
      amount: createForm.amount,
      createdById: user.id,
      createdDate: new Date()
    }, {transaction});

    if (createForm.assets && createForm.assets.length) {
      await createCostAsset(cost.id, user.companyId, createForm.assets, transaction);
    }

    if (createForm.purposeId && createForm.purposeId.length > 0 && createForm.relativeId && createForm.relativeId.length > 0) {
      await createCostPurpose(cost.id, createForm.purposeId, createForm.relativeId, transaction);
    }
    if (createForm.tagging && createForm.tagging.length) {
      await updateItemTags({
        id: cost.id,
        type: createForm.type === COST_TYPE.RECEIPT ? TAGGING_TYPE.RECEIPT_VOUCHER : TAGGING_TYPE.PAYMENT_VOUCHER,
        transaction,
        newTags: createForm.tagging
      });
      addTaggingQueue(createForm.tagging.map(t => t.id));
    }
    auditAction({
      actionId: PERMISSION.COST.CREATE,
      user, partnerPersonId: createForm.partnerPersonId, partnerCompanyId: createForm.partnerCompanyId,
      relativeId: String(cost.id)
    }).then();
    await transaction.commit();
    return cost;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function getCost(cId, user) {
  const cost = await db.Cost.findOne({
    where: {
      [Op.and]: [
        {id: cId},
        {companyId: user.companyId}
      ]
    },
    include: [
      {model: db.Person, as: 'partnerPerson', attributes: ['id', 'firstName', 'lastName', 'name']},
      {model: db.PaymentMethodSetting, as: 'paymentMethod'},
      {model: db.Company, as: 'partnerCompany', attributes: ['id', 'name']},
      {
        model: db.Asset,
        as: 'assets',
        attributes: ['id', 'name', 'type', 'ext', 'size', 'fileId', 'source'],
        through: {attributes: []}
      },
      {model: db.CostPurpose, as: 'costPurpose', attributes: ['purposeId', 'relativeId']},
      {
        model: db.TaggingItem, as: 'taggingItems',
        required: false,
        where: {
          itemType: {
            [Op.in]: [TAGGING_TYPE.PAYMENT_VOUCHER, TAGGING_TYPE.RECEIPT_VOUCHER]
          }
        },
        include: [
          {model: db.Tagging, as: 'tagging'}
        ]
      }
    ]
  });
  if (!cost) {
    throw badRequest('cost', FIELD_ERROR.INVALID, 'cost not found');
  }
  return mapping(cost.get({plain: true}));
}

export async function updateCost(cId, user, updateForm) {

  const existedCost = await db.Cost.findOne({
    where: {
      [Op.and]: [
        {id: cId},
        {companyId: user.companyId}
      ]
    },
    include: [
      {model: db.Asset, as: 'assets'},
      {
        model: db.TaggingItem, as: 'taggingItems',
        required: false,
        where: {
          itemType: {
            [Op.in]: [TAGGING_TYPE.PAYMENT_VOUCHER, TAGGING_TYPE.RECEIPT_VOUCHER]
          }
        }
      }]
  });
  if (!existedCost) {
    throw badRequest('cost', FIELD_ERROR.INVALID, 'cost not found');
  }
  const transaction = await db.sequelize.transaction();
  const type = Number(updateForm.type)
  try {
    await existedCost.update({
      name: updateForm.name,
      remark: updateForm.remark,
      type,
      companyId: user.companyId,
      paymentMethodId: updateForm.paymentMethod?.id,
      partnerCompanyId: updateForm.partnerCompanyId,
      partnerPersonId: updateForm.partnerPersonId,
      processedDate: updateForm.processedDate,
      amount: updateForm.amount,
      lastModifiedDate: new Date(),
      lastModifiedById: user.id
    }, transaction);

    if (updateForm.purposeId && updateForm.purposeId.length > 0 && updateForm.relativeId && updateForm.relativeId.length > 0) {
      await updateCostPurpose(existedCost.id, updateForm.purposeId, updateForm.relativeId, transaction);
    }

    const listMerge = await mergeAssets(existedCost.assets, updateForm.assets, user.companyId);
    if ((listMerge && listMerge.length) || (existedCost.assets && existedCost.assets.length)) {
      await updateCostAssets(existedCost.assets, listMerge, cId, transaction);
    }
    if ((updateForm.tagging && updateForm.tagging.length) || (existedCost.taggingItems && existedCost.taggingItems.length)) {
      await updateItemTags({
        id: cId,
        type: type === COST_TYPE.RECEIPT ? TAGGING_TYPE.RECEIPT_VOUCHER : TAGGING_TYPE.PAYMENT_VOUCHER,
        transaction,
        newTags: updateForm.tagging
      });

      addTaggingQueue([
        ...((updateForm.tagging || []).map(t => t.id)),
        ...((existedCost.taggingItems || []).map(t => t.taggingId))]
      );
    }

    auditAction({
      actionId: PERMISSION.COST.UPDATE,
      user, partnerPersonId: updateForm.partnerPersonId, partnerCompanyId: updateForm.partnerCompanyId,
      relativeId: String(cId)
    }).then();
    await transaction.commit();
    return existedCost;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function removeCost(cId, user) {
  const checkCost = await db.Cost.findOne({
    where: {
      [Op.and]: [
        {id: cId},
        {companyId: user.companyId}
      ]
    },
    include: [{model: db.Asset, as: 'assets'}]
  });
  if (!checkCost) {
    throw badRequest('cost', FIELD_ERROR.INVALID, 'cost not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    if (checkCost.assets && checkCost.assets.length) {
      await removeCostAssets(checkCost, transaction);
    }
    await removeCostPurpose(checkCost.id, transaction);
    const cost = db.Cost.destroy({
      where: {id: checkCost.id}
    }, {transaction});
    await transaction.commit();
    return cost;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
