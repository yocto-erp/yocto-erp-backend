import {smtpClient} from "./smtp.service";
import {mailgunClient} from "./mailgun.service";
import db from '../../db/models';
import {EMAIL_STATUS} from "../../db/models/email/email-send";
import {getEmailConfigure} from "../configuration/configuration.service";

export const EMAIL_PROVIDER = {
  SMTP: 'SMTP',
  MAILGUN: 'MAILGUN'
}

const getEmailClient = (configure) => {
  const {mailProvider} = configure;
  switch (mailProvider) {
    case EMAIL_PROVIDER.MAILGUN:
      return mailgunClient(configure);
    case EMAIL_PROVIDER.SMTP:
      return smtpClient(configure);
    default:
      throw new Error(`Not support email client ${mailProvider}`);
  }
}

export async function addEmailQueue(emailMessage, companyId, userId) {
  const {from, to, subject, message, attachments, bcc, cc} = emailMessage;
  const transaction = await db.sequelize.transaction();
  try {
    const email = await db.EmailSend.create({
      from: from,
      to: to,
      cc: cc || '',
      bcc: bcc || '',
      subject: subject,
      content: message,
      status: EMAIL_STATUS.PENDING,
      retry: 0,
      totalAttach: attachments ? attachments.length : 0
    }, {transaction});
    await db.EmailCompany.create({
      emailId: email.id,
      companyId,
      userId,
      createdDate: new Date()
    }, {transaction});
    if (attachments && attachments.length) {
      await db.EmailAttachment.bulkCreate(attachments.map((t, i) => ({
        id: i,
        emailId: email.id,
        type: t.type,
        data: t.data
      })), {transaction})
    }

    await transaction.commit();
    return email;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export function sendTestEmail(configure, {from, to, subject, message}) {
  return getEmailClient(configure).send({from, to, subject, html: message});
}

export async function sendCompanyEmail(emailId, companyId) {
  const transaction = await db.sequelize.transaction();
  try {
    const email = await db.EmailSend.findByPk(emailId, {
      include: [
        {model: db.EmailAttachment, as: 'attachments'}
      ],
      transaction,
      lock: transaction.LOCK.UPDATE
    })
    const {from, to, cc, bcc, content, subject, attachments} = email;
    console.log(attachments);
    // eslint-disable-next-line no-await-in-loop
    const emailConfigure = await getEmailConfigure(companyId)
    const emailMsg = {
      from, to, cc, bcc, html: content, subject, attachments: attachments.map(at => ({
        type: at.type,
        data: at.data
      }))
    };
    let resp = {};
    try {
      resp = await getEmailClient(emailConfigure).send(emailMsg);
      console.log(`Email Response: ${JSON.stringify(resp)}`);
      email.status = EMAIL_STATUS.SUCCESS;
    } catch (e) {
      resp = e;
      email.status = EMAIL_STATUS.FAIL;
    }

    email.api_response = JSON.stringify(resp);
    email.sent_date = new Date();
    await email.save({transaction});
    await transaction.commit();
  } catch (e) {
    console.log(e);
    await transaction.rollback();
  }
}

export async function emailQueueProcessing() {
  try {
    const listEmails = await db.EmailCompany.findAll({
      include: [
        {
          model: db.EmailSend, as: 'email', where: {
            status: EMAIL_STATUS.PENDING
          }
        }
      ],
      limit: 10
    });

    for (let i = 0; i < listEmails.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await sendCompanyEmail(listEmails[i].emailId, listEmails[i].companyId);
    }
  } catch (e) {
    console.log(e);
  }
}
