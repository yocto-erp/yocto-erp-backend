import db from "../../db/models";
import { removeCostPurpose } from "./cost-purpose.service";
import { badRequest, FIELD_ERROR } from "../../config/error";
import { taggingMapping, updateItemTags } from "../tagging/tagging.service";
import { TAGGING_TYPE } from "../../db/models/tagging/tagging-item-type";
import { COST_TYPE } from "../../db/models/cost/cost";
import { auditAction } from "../audit/audit.service";
import { PERMISSION } from "../../db/models/acl/acl-action";
import { addTaggingQueue } from "../../queue/tagging.queue";
import { hasText } from "../../util/string.util";
import { isGt0 } from "../../util/number.util";
import { isArray, isArrayHasLength } from "../../util/func.util";
import CostAsset from "../../db/models/cost/cost-asset";
import { buildDateRangeQuery } from "../../util/db.util";

const { Op } = db.Sequelize;

export async function costs(query, order, offset, limit, user) {
  const { tagging, search, subject, startDate, endDate, type } = query;
  const where = { companyId: user.companyId };
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
  if (subject && subject.id) {
    where.subjectId = subject.id;
  }
  if (hasText(startDate) && hasText(endDate)) {
    const dateTime = buildDateRangeQuery(startDate, endDate);
    if (dateTime) {
      where.createdDate = dateTime;
    }
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
  return db.Cost.scope("search").findAndCountAll({
    order,
    where,
    include: [
      {
        model: db.TaggingItem, as: "taggingItems",
        required: isTaggingRequired,
        where: whereTagging,
        include: [
          { model: db.Tagging, as: "tagging" }
        ]
      }
    ],
    offset,
    limit,
    group: ["id"]
  }).then((resp) => {
    return ({
      count: resp.count.length,
      rows: resp.rows.map(item => taggingMapping(item.get({ plain: true })))
    });
  });
}

export async function storeCost(user, createForm, transaction) {
  const { name, remark, type, paymentMethod, subject, amount, assets, purposeId, relativeId, tagging } = createForm;
  const cost = await db.Cost.create({
    name,
    remark,
    companyId: user.companyId,
    type,
    paymentMethodId: paymentMethod?.id,
    subjectId: subject?.id,
    processedDate: new Date(),
    amount,
    createdById: user.id,
    createdDate: new Date()
  }, { transaction });

  if (isArrayHasLength(assets)) {
    await db.CostAsset.bulkCreate(assets.map(t => ({
      costId: cost.id,
      assetId: t.id
    })), { transaction });
  }

  console.log("Create COst purpose", purposeId, relativeId);
  if (purposeId && relativeId) {
    console.log("Created");
    await db.CostPurpose.create({
      costId: cost.id,
      purposeId,
      relativeId
    }, { transaction });
  }
  if (isArrayHasLength(tagging)) {
    await updateItemTags({
      id: cost.id,
      type: Number(createForm.type) === COST_TYPE.RECEIPT ? TAGGING_TYPE.RECEIPT_VOUCHER : TAGGING_TYPE.PAYMENT_VOUCHER,
      transaction,
      newTags: tagging
    });
  }
  return cost;
}

export async function createCost(user, createForm) {
  const transaction = await db.sequelize.transaction();

  try {
    const cost = await storeCost(user, createForm, transaction);
    await transaction.commit();
    auditAction({
      actionId: PERMISSION.COST.CREATE,
      user, partnerPersonId: createForm.partnerPersonId, partnerCompanyId: createForm.partnerCompanyId,
      relativeId: String(cost.id)
    }).then();
    if (createForm.tagging && createForm.tagging.length) {
      addTaggingQueue([...new Set(createForm.tagging.map(t => t.id))]);
    }

    return cost;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function getCost(cId, user) {
  const cost = await db.Cost.scope("search").findOne({
    where: {
      [Op.and]: [
        { id: cId },
        { companyId: user.companyId }
      ]
    },
    include: [
      {
        model: db.Asset,
        as: "assets",
        through: { attributes: [] }
      },
      { model: db.CostPurpose, as: "costPurpose", attributes: ["purposeId", "relativeId"] },
      { model: db.Tagging, as: "tagging" }
    ]
  });
  if (!cost) {
    throw badRequest("cost", FIELD_ERROR.INVALID, "cost not found");
  }
  return cost;
}

export async function updateCost(cId, user, updateForm) {
  const existedCost = await getCost(cId, user);
  const transaction = await db.sequelize.transaction();
  const type = Number(updateForm.type);
  try {
    await existedCost.update({
      name: updateForm.name,
      remark: updateForm.remark,
      type,
      companyId: user.companyId,
      paymentMethodId: updateForm.paymentMethod?.id,
      subjectId: updateForm.subject?.id,
      amount: updateForm.amount,
      lastModifiedDate: new Date(),
      lastModifiedById: user.id
    }, transaction);

    if (updateForm.purposeId && updateForm.relativeId) {
      return db.CostPurpose.update({
        purposeId: updateForm.purposeId,
        relativeId: updateForm.relativeId
      }, {
        where: {
          costId: existedCost.id
        }
      }, { transaction });
    }

    if (existedCost.assets && existedCost.assets.length) {
      await db.CostAsset.destroy({
        where: {
          costId: existedCost.id
        }
      }, { transaction });
    }
    if (updateForm.assets && updateForm.assets.length) {
      await CostAsset.bulkCreate(
        updateForm.assets.map((t) => {
          return {
            assetId: t.id,
            costId: existedCost.id
          };
        }),
        { transaction }
      );
    }

    let listUpdateTags = [];
    if ((updateForm.tagging && updateForm.tagging.length) || (existedCost.tagging && existedCost.tagging.length)) {
      await updateItemTags({
        id: cId,
        type: Number(type) === COST_TYPE.RECEIPT ? TAGGING_TYPE.RECEIPT_VOUCHER : TAGGING_TYPE.PAYMENT_VOUCHER,
        transaction,
        newTags: updateForm.tagging
      });

      listUpdateTags = [...new Set([...((updateForm.tagging || []).map(t => t.id)),
        ...((existedCost.tagging || []).map(t => t.id))])];
    }

    await transaction.commit();
    auditAction({
      actionId: PERMISSION.COST.UPDATE,
      user, partnerPersonId: updateForm.partnerPersonId, partnerCompanyId: updateForm.partnerCompanyId,
      relativeId: String(cId)
    }).then();
    if (listUpdateTags.length) {
      addTaggingQueue(listUpdateTags);
    }
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
        { id: cId },
        { companyId: user.companyId }
      ]
    },
    include: [{ model: db.Asset, as: "assets" }]
  });
  if (!checkCost) {
    throw badRequest("cost", FIELD_ERROR.INVALID, "cost not found");
  }
  const transaction = await db.sequelize.transaction();
  try {
    if (checkCost.assets && checkCost.assets.length) {
      await db.CostAsset.destroy({
        where: {
          costId: checkCost.id
        }
      }, { transaction });
    }
    await removeCostPurpose(checkCost.id, transaction);
    const cost = db.Cost.destroy({
      where: { id: checkCost.id }
    }, { transaction });
    await transaction.commit();
    return cost;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
