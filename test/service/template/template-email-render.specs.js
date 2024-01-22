import { sendTemplateEmail } from '../../../app/service/template/template-email-render.service';
import db from '../../../app/db/models';
import { toPrintData } from '../../../app/service/form/form.util';
import { buildEmail } from '../../../app/service/email/email.util';
import { getFormInfo } from '../../../app/service/form/form.service';

describe('template-email-render.specs.js', () => {
  it('template-render', async function renderTemplate() {
    const formRegister = await db.FormRegister.findOne({
      where: {
        id: 16
      },
      include: [
        { model: db.Form, as: 'form' }
      ]
    });
    const form = await getFormInfo(formRegister.form);
    const printData = toPrintData(formRegister);
    console.log(printData);
    await sendTemplateEmail({
      userId: form.createdById,
      companyId: formRegister.form.companyId,
      emailTemplateId: form.registerTemplate.templateId
    }, { to: [buildEmail({ email: formRegister.email, name: formRegister.name })], printData });
  });
});
