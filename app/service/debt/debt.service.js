import { hasText } from "../../util/string.util";
import db from "../../db/models";
import { badRequest, FIELD_ERROR } from "../../config/error";
import { updateItemTags } from "../tagging/tagging.service";
import { TAGGING_TYPE } from "../../db/models/tagging/tagging-item-type";
import { auditAction } from "../audit/audit.service";
import { PERMISSION } from "../../db/models/acl/acl-action";
import { addTaggingQueue } from "../../queue/tagging.queue";
import {
  updateOrCreateDebtBalance
} from "./debt-subject-balance.service";
import { isArrayHasLength } from "../../util/func.util";

const { Op } = db.Sequelize;

export function debts(user, query, { order, offset, limit }) {
  const { search, type, subject } = query;
  console.log(query);
  const where = { companyId: user.companyId };
  let isRequiredSubject = false;
  const whereSubject = {};

  if (subject) {
    whereSubject.id = subject.id;
    isRequiredSubject = true;
  }
  if (type) {
    where.type = type;
  }
  if (hasText(search)) {
    where[Op.or] = [
      {
        name: {
          [Op.like]: `%${search}%`
        }
      }
    ];
  }
  console.log(where);
  return db.Debt.findAndCountAll({
    where,
    include: [
      {
        model: db.User,
        as: "createdBy",
        attributes: ["id", "displayName", "email"]
      },
      {
        model: db.Tagging,
        as: "tagging"
      },
      {
        model: db.Subject,
        as: "subject",
        required: isRequiredSubject,
        where: whereSubject,
        include: [
          {
            model: db.Person, as: "person"
          },
          {
            model: db.Company, as: "company"
          }
        ]
      }
    ],
    group: ["id"],
    order,
    offset,
    limit
  }).then((resp) => {
    return ({
      count: resp.count.length,
      rows: resp.rows
    });
  });
}

export async function getDebt(user, dId) {
  const debt = await db.Debt.findOne({
    where: {
      id: dId,
      companyId: user.companyId
    },
    include: [
      { model: db.Tagging, as: "tagging" },
      { model: db.Debt, as: "settleDebt" },
      {
        model: db.Subject,
        as: "subject",
        include: [
          {
            model: db.Person, as: "person"
          },
          {
            model: db.Company, as: "company"
          }
        ]
      }
    ]
  });
  if (!debt) {
    throw badRequest("debt", FIELD_ERROR.INVALID, "Debt not found");
  }
  return debt;
}

export async function storeDebt(user, createForm, transaction) {
  const {
    name,
    type,
    remark,
    subject,
    amount,
    tagging,
    settleDebt,
    relateId,
    purposeType
  } = createForm;
  const newDebt = await db.Debt.create({
    name,
    type: Number(type),
    subjectId: subject.id,
    remark,
    amount,
    companyId: user.companyId,
    createdDate: new Date(),
    createdById: user.id,
    settleDebtId: settleDebt?.id
  }, { transaction });

  if (relateId && purposeType) {
    await db.DebtDetail.create({
      debtId: newDebt.id,
      relateId,
      purposeType
    }, { transaction });
  }

  await updateOrCreateDebtBalance(subject.id, user.companyId, null, amount, Number(type), transaction);

  if (isArrayHasLength(tagging)) {
    await updateItemTags({
      id: newDebt.id,
      type: TAGGING_TYPE.DEBT,
      transaction,
      newTags: tagging
    });
  }
  return newDebt;
}

export async function createDebt(user, createForm, tracking = {}) {
  const {
    subject,
    tagging
  } = createForm;
  const transaction = await db.sequelize.transaction();
  try {
    const newDebt = await storeDebt(user, createForm, transaction);
    await transaction.commit();

    auditAction({
      actionId: PERMISSION.DEBT.CREATE,
      user,
      subject,
      relativeId: String(newDebt.id),
      tracking
    }).then();
    if (tagging && tagging.length) {
      addTaggingQueue([...new Set(tagging.map(t => t.id))]);
    }

    return newDebt;
  } catch (e) {
    console.error(e);
    await transaction.rollback();
    throw e;
  }
}

export async function updateDebt(dId, user, updateForm) {
  const {
    name,
    type,
    remark,
    subject,
    amount,
    tagging,
    settleDebt
  } = updateForm;
  const existedDebt = await getDebt(user, dId);
  const transaction = await db.sequelize.transaction();
  try {
    await updateOrCreateDebtBalance(subject.id, user.companyId, existedDebt, amount, Number(type), transaction);
    await existedDebt.update({
      name,
      type: Number(type),
      subjectId: subject.id,
      remark,
      amount,
      companyId: user.companyId,
      createdById: user.id,
      settleDebtId: settleDebt?.id
    }, transaction);
    let listUpdateTags = [];
    if ((tagging && tagging.length) || (existedDebt.tagging && existedDebt.tagging.length)) {
      await updateItemTags({
        id: existedDebt.id,
        type: TAGGING_TYPE.DEBT,
        transaction,
        newTags: tagging
      });

      listUpdateTags = [...new Set([...((tagging || []).map(t => t.id)),
        ...((existedDebt.tagging || []).map(t => t.id))])];
    }
    await transaction.commit();
    auditAction({
      actionId: PERMISSION.DEBT.UPDATE,
      user,
      subject: subject,
      relativeId: String(existedDebt.id)
    }).then();
    if (listUpdateTags.length) {
      addTaggingQueue(listUpdateTags);
    }

    return existedDebt;
  } catch (e) {
    console.error(e);
    await transaction.rollback();
    throw e;
  }
}

export async function removeDebt(user, dId) {
  const checkDebt = await getDebt(user, dId);

  const transaction = await db.sequelize.transaction();
  try {
    await updateOrCreateDebtBalance(checkDebt.subjectId, user.companyId, checkDebt, 0, checkDebt.type, transaction);
    await checkDebt.destroy({ transaction });
    let listUpdateTags = [];
    if (isArrayHasLength(checkDebt.tagging)) {
      await db.TaggingItem.destroy({
        where: {
          itemType: TAGGING_TYPE.DEBT,
          itemId: checkDebt.id
        },
        transaction
      });
      listUpdateTags = [...new Set(((checkDebt.tagging || []).map(t => t.id)))];
    }
    await transaction.commit();
    auditAction({
      actionId: PERMISSION.DEBT.DELETE,
      user,
      subject: checkDebt.subject,
      relativeId: String(checkDebt.id)
    }).then();
    if (listUpdateTags.length) {
      addTaggingQueue(listUpdateTags);
    }
    return checkDebt;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export function commonDebts(user, query, { order, offset, limit }) {
  const { search } = query;
  const where = { companyId: user.companyId };
  const whereSubject = {};
  if (hasText(search)) {
    whereSubject[Op.or] = [
      {
        name: {
          [Op.like]: `%${search}%`
        }
      },
      {
        email: {
          [Op.like]: `%${search}%`
        }
      },
      {
        gsm: {
          [Op.like]: `%${search}%`
        }
      }
    ];
  }
  return db.DebtSubjectBalance.findAndCountAll({
    where,
    include: [
      {
        model: db.Subject.scope("all"),
        as: "subject",
        where: whereSubject
      }
    ],
    order,
    offset,
    limit
  });
}
