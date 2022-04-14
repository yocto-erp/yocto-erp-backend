import { hasText } from "../../util/string.util";
import db from "../../db/models";
import { badRequest, FIELD_ERROR } from "../../config/error";
import { updateItemTags } from "../tagging/tagging.service";
import { TAGGING_TYPE } from "../../db/models/tagging/tagging-item-type";
import { auditAction } from "../audit/audit.service";
import { PERMISSION } from "../../db/models/acl/acl-action";
import { addTaggingQueue } from "../../queue/tagging.queue";
import { createDebtBalance, updateDebtBalance, updateDebtBalanceWhenDeleteDebt } from "./debt-subject-balance.service";
import { DEBT_TYPE } from "../../db/models/debt/debt";
import { isArrayHasLength } from "../../util/func.util";

const { Op } = db.Sequelize;

export function debts(user, query, { order, offset, limit }) {
  const { search, debtType } = query;
  const where = { companyId: user.companyId };
  if (debtType) {
    where.type = debtType;
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
  const debt = await db.Debt.scope("search").findOne({
    where: {
      id: dId,
      companyId: user.companyId
    },
    include: [
      { model: db.Tagging, as: "tagging" },
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
    settleDebtId,
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
    settleDebtId: Number(type) === DEBT_TYPE.RECOVERY_PUBLIC_DEBT || Number(type) === DEBT_TYPE.PAID_DEBT ? settleDebtId.id : null
  }, { transaction });

  if (relateId && purposeType) {
    await db.DebtDetail.create({
      debtId: newDebt.id,
      relateId,
      purposeType
    }, { transaction });
  }

  const checkDebtSubjectBalance = await db.DebtSubjectBalance.findOne({
    where: {
      companyId: user.companyId,
      subjectId: subject.id
    }
  }, { transaction });

  if (!checkDebtSubjectBalance) {
    await createDebtBalance(user, subject.id, type, amount, transaction);
  } else {
    await updateDebtBalance(user, type, amount, checkDebtSubjectBalance, transaction);
  }

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

export async function createDebt(user, createForm) {
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
      relativeId: String(newDebt.id)
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
    settleDebtId
  } = updateForm;
  const existedDebt = await getDebt(dId, user);
  const transaction = await db.sequelize.transaction();
  try {
    await existedDebt.update({
      name,
      type: Number(type),
      subjectId: subject.id,
      remark,
      amount,
      companyId: user.companyId,
      createdById: user.id,
      settleDebtId: DEBT_TYPE.RECOVERY_PUBLIC_DEBT || DEBT_TYPE.PAID_DEBT ? settleDebtId.id : null
    }, transaction);

    const checkDebtSubjectBalance = await db.DebtSubjectBalance.findOne({
      where: {
        companyId: user.companyId,
        subjectId: subject.id
      }
    });

    if (!checkDebtSubjectBalance) {
      await createDebtBalance(user, subject.id, type, amount, transaction);
    } else {
      await updateDebtBalance(user, type, amount, checkDebtSubjectBalance, transaction);
    }

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
    await updateDebtBalanceWhenDeleteDebt(user, checkDebt, transaction);
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
      listUpdateTags = [...new Set(((checkDebt.checkDebt || []).map(t => t.id)))];
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
