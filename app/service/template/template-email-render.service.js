import Mustache from 'mustache';
import { badRequest } from '../../config/error';
import { getEmailTemplate } from './template-email.service';
import { addEmailQueue } from '../email/company-email.service';

export async function emailTemplateRender(templateId, { companyId }, object) {
  const emailTemplate = await getEmailTemplate(templateId, { companyId });
  if (!emailTemplate) {
    throw badRequest('emailTemplate', 'NOT_FOUND', `Not found any email template with ID ${templateId}`);
  }

  const { subject, template: { content }, ...other } = emailTemplate;

  const subjectText = Mustache.render(subject, object);
  const contentHTML = Mustache.render(content, object);

  return {
    ...other,
    subject: subjectText,
    content: contentHTML
  };
}

/**
 * This will help send out email with templateId and data for render
 * @param to
 * @param printData
 * @param emailTemplateId
 * @param companyId
 * @param userId
 * @return {Promise<Model<any, TModelAttributes>|undefined>}
 */
export async function sendTemplateEmail({ emailTemplateId, companyId, userId = 0 }, { to, printData }) {
  const email = await emailTemplateRender(emailTemplateId, { companyId }, printData);

  const emailMessage = {
    from: email.from,
    cc: email.cc,
    bcc: email.bcc,
    to: to.join(','),
    subject: email.subject,
    message: email.content
  };
  console.log(emailMessage)
  return addEmailQueue(emailMessage, companyId, userId);
}
