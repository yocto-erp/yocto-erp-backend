import Mustache from "mustache";
import {badRequest} from "../../config/error";
import {getEmailTemplate} from "./template-email.service";

export async function emailTemplateRender(templateId, user, object) {
  const emailTemplate = await getEmailTemplate(templateId, user);
  if (!emailTemplate) {
    throw badRequest('emailTemplate', 'NOT_FOUND', `Not found any email template with ID ${templateId}`);
  }

  const {subject, template: {content}} = emailTemplate;

  const subjectText = Mustache.render(subject, object);
  const contentHTML = Mustache.render(content, object);

  return {
    subject: subjectText,
    content: contentHTML
  }
}
