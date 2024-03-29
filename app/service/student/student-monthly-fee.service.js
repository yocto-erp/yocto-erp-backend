import { v4 as uuidv4 } from "uuid";
import Mustache from "mustache";
import db from "../../db/models";
import { badRequest, FIELD_ERROR } from "../../config/error";
import { hex2binary } from "../../util/string.util";
import { formatDateTime, formatTemplateMoney, personToPrintData } from "../template/template.util";
import { templateRenderPDF } from "../template/template-render.service";
import { getEmailTemplate } from "../template/template-email.service";
import { EMAIL_ATTACHMENT_TYPE } from "../../db/models/email/email-attachment";
import { addEmailQueue } from "../email/company-email.service";
import { COST_TYPE } from "../../db/models/cost/cost";
import { updateItemTags } from "../tagging/tagging.service";
import { TAGGING_TYPE } from "../../db/models/tagging/tagging-item-type";
import { addTaggingQueue } from "../../queue/tagging.queue";

const { Op } = db.Sequelize;

export async function listStudentMonthlyFee(query, order, offset, limit, user) {
  console.log(query);
  const { search, month: monthStr, isPaid, class: studentClass } = query;
  const where = {};
  let wherePerson = {};
  if (search && search.length) {
    wherePerson = {
      [Op.or]: [
        {
          "$student.child.firstName$": {
            [Op.like]: `%${search}%`
          }
        }, {
          "$student.child.lastName$": {
            [Op.like]: `%${search}%`
          }
        }, {
          "$student.alias$": {
            [Op.like]: `%${search}%`
          }
        }
      ]
    };
  }
  if (isPaid === "1") {
    where.paidDate = null;
  } else if (isPaid === "2") {
    where.paidDate = {
      [Op.ne]: null
    };
  }

  if (studentClass) {
    wherePerson["$student.classId$"] = studentClass.id;
  }
  if (monthStr && monthStr.year && monthStr.month) {
    where.monthFee = monthStr.month;
    where.yearFee = monthStr.year;
  }
  where.companyId = user.companyId;
  console.log(isPaid, where);
  const _order = order.map(t => {
    const [col, dir] = t;
    if (col === "lastName") {
      return [{ model: db.Student, as: "student" }, { model: db.Person, as: "child" }, col, dir];
    }
    return t;
  });
  const resp = await db.StudentMonthlyFee.findAndCountAll({
    order: _order,
    where: {
      ...wherePerson, ...where
    },
    include: [
      {
        model: db.Student, as: "student",
        required: true,
        include: [
          { model: db.Person, as: "child", required: true },
          {
            model: db.StudentClass, as: "class"
          }
        ]
      }
    ],
    offset,
    limit
  });
  const { rows, count } = resp;
  const response = rows.map(r => {
    const uuid = Buffer.from(r.id, "hex").toString("hex");
    const rs = r.get({ plain: true });
    rs.id = uuid;
    return rs;
  });
  return {
    count,
    rows: response
  };
}

export async function getStudentMonthlyFee(sId, user) {
  const splitIds = sId.split(",");
  const ids = [];
  for (let i = 0; i < splitIds.length; i += 1) {
    ids.push(Buffer.from(splitIds[i], "hex"));
  }
  const students = await db.StudentMonthlyFee.findAll({
    where: {
      id: ids,
      companyId: user.companyId
    },
    include: [
      {
        model: db.Student, as: "student",
        include: [
          {
            model: db.Person, as: "child",
            attributes: ["id", "firstName", "lastName", "name"]
          },
          {
            model: db.StudentClass, as: "class"
          }
        ]
      }
    ]
  });
  return students.map(r => {
    const uuid = Buffer.from(r.id, "hex").toString("hex");
    const rs = r.get({ plain: true });
    rs.id = uuid;
    return rs;
  });
}

export async function createStudentMonthlyFee(user, createForm) {
  try {
    if (createForm && createForm.details) {
      for (let i = 0; i < createForm.details.length; i += 1) {
        const { monthYear: { from, to, numberOfMonths } } = createForm.details[i];

        const uuidS = hex2binary(uuidv4());

        // eslint-disable-next-line no-await-in-loop
        await db.StudentMonthlyFee.create({
          id: uuidS,
          monthFee: from.month,
          yearFee: from.year,
          scholarShip: createForm.details[i].scholarShip,
          scholarFee: createForm.details[i].scholarFee,
          studentId: createForm.details[i].studentId,
          companyId: user.companyId,
          absentDay: createForm.details[i].absentDay,
          absentDayFee: createForm.details[i].absentDayFee,
          trialDate: createForm.details[i].trialDate,
          trialDateFee: createForm.details[i].trialDateFee,
          busFee: createForm.details[i].busFee,
          debt: createForm.details[i].debt,
          mealFee: createForm.details[i].mealFee,
          otherFee: +createForm.details[i].otherFee,
          otherDeduceFee: +createForm.details[i].otherDeduceFee,
          remark: createForm.details[i].remark,
          feePerMonth: createForm.details[i].feePerMonth,
          totalAmount: createForm.details[i].totalAmount,
          studentAbsentDay: createForm.details[i].studentAbsentDay,
          studentAbsentDayFee: createForm.details[i].studentAbsentDayFee,
          toMonth: to?.month,
          toYear: to?.year,
          numberOfMonths,
          lastUpdatedDate: new Date(),
          lastUpdatedById: user.id
        });
      }
    }
    return true;
  } catch (e) {
    console.log(e);
    throw badRequest("student", FIELD_ERROR.INVALID, "student Exist");
  }
}

export async function updateStudentMonthlyFee(sId, updateForm, user) {

  if (updateForm && updateForm.details) {
    const transaction = await db.sequelize.transaction();
    try {
      for (let i = 0; i < updateForm.details.length; i += 1) {
        const { monthYear: { from, to, numberOfMonths } } = updateForm.details[i];

        // eslint-disable-next-line no-await-in-loop
        const studentFee = await db.StudentMonthlyFee.findOne({
          where: {
            id: Buffer.from(updateForm.details[i].id, "hex"),
            companyId: user.companyId
          }, transaction
        });
        if (!studentFee) {
          throw badRequest("studentFee", FIELD_ERROR.INVALID, `Student Fee not exist`);
        }
        // eslint-disable-next-line no-await-in-loop
        await studentFee.update({
          monthFee: from.month,
          yearFee: from.year,
          scholarShip: updateForm.details[i].scholarShip,
          scholarFee: updateForm.details[i].scholarFee,
          studentId: updateForm.details[i].studentId,
          companyId: user.companyId,
          absentDay: updateForm.details[i].absentDay,
          absentDayFee: updateForm.details[i].absentDayFee,
          trialDate: updateForm.details[i].trialDate,
          trialDateFee: updateForm.details[i].trialDateFee,
          busFee: updateForm.details[i].busFee,
          mealFee: updateForm.details[i].mealFee,
          otherFee: updateForm.details[i].otherFee,
          debt: updateForm.details[i].debt,
          otherDeduceFee: +updateForm.details[i].otherDeduceFee,
          remark: updateForm.details[i].remark,
          studentAbsentDay: updateForm.details[i].studentAbsentDay,
          studentAbsentDayFee: updateForm.details[i].studentAbsentDayFee,
          feePerMonth: updateForm.details[i].feePerMonth,
          totalAmount: updateForm.details[i].totalAmount,
          toMonth: to?.month,
          toYear: to?.year,
          numberOfMonths,
          lastUpdatedDate: new Date(), lastUpdatedById: user.id
        }, { transaction });
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  return true;
}

export async function deleteListStudentMonthlyFee(sId, user) {
  const listId = sId.map(t => hex2binary(t));
  console.log(listId);
  return db.StudentMonthlyFee.destroy({
    where: {
      id: {
        [Op.in]: listId
      },
      companyId: user.companyId
    }
  });
}

async function getStudentMonthlyFeeItem(id, companyId) {
  const bId = hex2binary(id);
  return db.StudentMonthlyFee.findOne({
    where: {
      id: bId,
      companyId
    }, include: [
      {
        model: db.Student, as: "student",
        include: [
          {
            model: db.Person, as: "child"
          }, {
            model: db.Person, as: "father"
          }, {
            model: db.Person, as: "mother"
          }
        ]
      }
    ]
  });
}

export async function removeStudentMonthlyFee(sId, user) {
  const checkStudent = await getStudentMonthlyFeeItem(sId, user.companyId);
  if (!checkStudent) {
    throw badRequest("student", FIELD_ERROR.INVALID, "Student fee not found");
  }

  return checkStudent.destroy();
}

export async function toPrintData(id, companyId) {
  const bId = hex2binary(id);
  const fee = await db.StudentMonthlyFee.findOne({
    where: {
      id: bId,
      companyId
    }, include: [
      {
        model: db.Student, as: "student",
        include: [
          { model: db.DebtSubjectBalance, as: "debt" },
          {
            model: db.Person, as: "child"
          }, {
            model: db.Person, as: "father"
          }, {
            model: db.Person, as: "mother"
          }
        ]
      }
    ]
  });

  const monthStr = `0${fee.monthFee + 1}`;
  let toMonthStr = "";
  if (fee.toMonth > 0) {
    toMonthStr = `0${fee.toMonth + 1}`;
    toMonthStr = toMonthStr.substring(toMonthStr.length - 2);
  }

  const debt = fee.student?.debt?.debit || 0;
  const credit = fee.student?.debt?.credit || 0;
  const total = fee.totalAmount + debt - credit;

  const studentFee = {
    monthFee: monthStr,
    trialDate: fee.trialDate,
    trialDateFee: formatTemplateMoney(fee.trialDateFee),
    yearFee: fee.yearFee,
    toMonth: toMonthStr,
    toYear: fee.toYear,
    numberOfMonths: fee.numberOfMonths || 1,
    scholarShip: formatTemplateMoney(fee.scholarFee),
    scholarShipPercent: `${fee.scholarShip} %`,
    tuitionFee: formatTemplateMoney(fee.feePerMonth * (fee.numberOfMonths || 1)),
    mealFee: formatTemplateMoney(fee.mealFee),
    absentDay: fee.absentDay,
    absentDayFee: fee.absentDayFee,
    studentAbsentDay: fee.studentAbsentDay,
    studentAbsentDayFee: formatTemplateMoney(fee.studentAbsentDayFee),
    deduceTuition: formatTemplateMoney(fee.deduceTuition),
    busFee: formatTemplateMoney(fee.busFee),
    beginningYearFee: formatTemplateMoney(fee.beginningYearFee),
    otherFee: formatTemplateMoney(fee.otherFee),
    otherDeduceFee: formatTemplateMoney(fee.otherDeduceFee),
    debtNumber: debt,
    creditNumber: debt,
    debt: formatTemplateMoney(debt),
    credit: formatTemplateMoney(credit),
    remark: fee.remark,
    total: formatTemplateMoney(total)
  };
  const student = personToPrintData(fee.student.child);

  const father = personToPrintData(fee.student.father);

  const mother = personToPrintData(fee.student.mother);

  return {
    name: `${student.firstName} ${student.lastName}_${formatDateTime(fee.lastUpdatedDate)}`,
    studentFee, student, mother, father
  };
}

export async function generatePDF(templateId, feeId, companyId) {
  const templateData = await toPrintData(feeId, companyId);
  return templateRenderPDF(templateId, templateData, templateData.name);
}

async function processSendEmailForFee(feeId, emailTemplate, printTemplateId, isPDFAttached, user, from, cc, bcc) {
  const attachments = [];
  const templateData = await toPrintData(feeId, user.companyId);
  if (isPDFAttached) {
    attachments.push(
      {
        type: EMAIL_ATTACHMENT_TYPE.ASSET,
        data: await templateRenderPDF(printTemplateId, templateData, templateData.name)
      }
    );
  }
  const { subject, template: { content } } = emailTemplate;

  const subjectText = Mustache.render(subject, templateData);
  const contentHTML = Mustache.render(content, templateData);

  const to = [];
  const { father, mother } = templateData;
  if (father && father.email) {
    to.push(`${father.firstName} ${father.lastName} <${father.email}>`);
  }
  if (mother && mother.email) {
    to.push(`${mother.firstName} ${mother.lastName} <${mother.email}>`);
  }

  const emailMessage = {
    from,
    cc: cc ? cc.join(",") : "",
    bcc: bcc ? bcc.join(",") : "",
    to: to.join(","),
    subject: subjectText,
    message: contentHTML,
    attachments
  };
  return addEmailQueue(emailMessage, user.companyId, user.id);
}

export async function sendEmails({ listId, emailTemplateId, isPDFAttached, printTemplateId, from, cc, bcc }, user) {
  const emailTemplate = await getEmailTemplate(emailTemplateId, user);
  if (!emailTemplate) {
    throw badRequest("EmailTemplate", "NOT_FOUND", "Invalid email template");
  }
  const rs = {
    success: [],
    fail: []
  };
  for (let i = 0; i < listId.length; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop,no-unused-vars
      await processSendEmailForFee(listId[i], emailTemplate, printTemplateId, isPDFAttached, user, from, cc, bcc);
      rs.success.push(listId[i]);
    } catch (e) {
      console.error(e);
      rs.fail.push({ id: listId[i], message: e.message });
    }
  }
  return rs;
}

export async function paidMonthlyFee(feeId, form, user) {
  const {
    amount,
    bcc,
    cc,
    content,
    from,
    remark,
    sendEmailConfirm,
    storeCashIn, storeCashInName, storeCashInAmount, storeCashInTagging,
    storeCashInMeal, storeCashInMealName, storeCashInMealAmount, storeCashInMealTagging,
    storeCashInBus, storeCashInBusName, storeCashInBusAmount, storeCashInBusTagging,
    storeOtherCashIn, storeOtherCashInName, storeOtherCashInAmount, storeOtherCashInTagging,
    subject
  } = form;
  const { companyId } = user;
  const fee = await getStudentMonthlyFeeItem(feeId, user.companyId);
  if (!fee) {
    throw badRequest("studentFee", FIELD_ERROR.INVALID, "Student fee not found");
  }
  const transaction = await db.sequelize.transaction();
  try {
    fee.paidAmount = amount;
    fee.paidDate = new Date();
    fee.paidInformation = remark;
    if (storeCashIn) {
      const cost = await db.Cost.create({
        name: storeCashInName,
        remark: remark,
        companyId: companyId,
        type: COST_TYPE.RECEIPT,
        processedDate: new Date(),
        amount: storeCashInAmount,
        createdById: user.id,
        createdDate: new Date()
      }, { transaction });

      if (storeCashInTagging && storeCashInTagging.length) {
        await updateItemTags({
          id: cost.id,
          type: TAGGING_TYPE.RECEIPT_VOUCHER,
          transaction,
          newTags: storeCashInTagging
        });
        addTaggingQueue(storeCashInTagging.map(t => t.id));
      }

      fee.costId = cost.id;
    }
    if (storeCashInMeal) {
      const mealCost = await db.Cost.create({
        name: storeCashInMealName,
        companyId: companyId,
        type: COST_TYPE.RECEIPT,
        processedDate: new Date(),
        amount: storeCashInMealAmount,
        createdById: user.id,
        createdDate: new Date()
      }, { transaction });

      if (storeCashInMealTagging && storeCashInMealTagging.length) {
        await updateItemTags({
          id: mealCost.id,
          type: TAGGING_TYPE.RECEIPT_VOUCHER,
          transaction,
          newTags: storeCashInMealTagging
        });
        addTaggingQueue(storeCashInMealTagging.map(t => t.id));
      }
    }
    if (storeCashInBus) {
      const busCost = await db.Cost.create({
        name: storeCashInBusName,
        companyId: companyId,
        type: COST_TYPE.RECEIPT,
        processedDate: new Date(),
        amount: storeCashInBusAmount,
        createdById: user.id,
        createdDate: new Date()
      }, { transaction });

      if (storeCashInBusTagging && storeCashInBusTagging.length) {
        await updateItemTags({
          id: busCost.id,
          type: TAGGING_TYPE.RECEIPT_VOUCHER,
          transaction,
          newTags: storeCashInBusTagging
        });
        addTaggingQueue(storeCashInBusTagging.map(t => t.id));
      }
    }
    if (storeOtherCashIn) {
      const otherCost = await db.Cost.create({
        name: storeOtherCashInName,
        companyId: companyId,
        type: COST_TYPE.RECEIPT,
        processedDate: new Date(),
        amount: storeOtherCashInAmount,
        createdById: user.id,
        createdDate: new Date()
      }, { transaction });

      if (storeOtherCashInTagging && storeOtherCashInTagging.length) {
        await updateItemTags({
          id: otherCost.id,
          type: TAGGING_TYPE.RECEIPT_VOUCHER,
          transaction,
          newTags: storeOtherCashInTagging
        });
        addTaggingQueue(storeOtherCashInTagging.map(t => t.id));
      }
    }
    await fee.save({ transaction });
    await transaction.commit();
    if (sendEmailConfirm) {
      const to = [];
      const { father, mother } = fee.student;
      if (father && father.email) {
        to.push(`${father.firstName} ${father.lastName} <${father.email}>`);
      }
      if (mother && mother.email) {
        to.push(`${mother.firstName} ${mother.lastName} <${mother.email}>`);
      }
      const emailMessage = {
        from,
        cc: cc ? cc.join(",") : "",
        bcc: bcc ? bcc.join(",") : "",
        to: to.join(","),
        subject,
        message: content
      };
      addEmailQueue(emailMessage, user.companyId, user.id).then();
    }
    return fee;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}
