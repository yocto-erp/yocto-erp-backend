import {
  addEmailQueue,
  EMAIL_PROVIDER,
  emailQueueProcessing,
  sendTestEmail
} from "../../app/service/email/company-email.service";
import {EMAIL_ENCRYPTION} from "../../app/service/email/smtp.service";
import fs from 'fs';
import path from 'path';
import {EMAIL_ATTACHMENT_TYPE} from "../../app/db/models/email/email-attachment";

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('company-email.service.js', () => {
  beforeEach(async () => {
  });

  it('sendTestSMTPEmail', async () => {
    const configure = {
      mailProvider: EMAIL_PROVIDER.SMTP, smtp: {
        host: 'smtp.ethereal.email',
        username: 'kieran.oconnell@ethereal.email',
        password: 'jPt2aEebQU2mUKzuNf',
        encryption: EMAIL_ENCRYPTION.TLS
      }
    };
    const emailOpts = {
      from: 'kieran.oconnell@ethereal.email',
      to: 'lephuoccanh@gmail.com',
      subject: 'Testing email',
      message: 'Send test email via SMTP'
    };
    await sendTestEmail(configure, emailOpts).then(t => {
      console.log(t);
      t.should.have.property('accepted').with.lengthOf(1);
      t.should.have.property('response');
    })
  });

  it('add email to queue', async () => {
    const yoctoFile = path.resolve(__dirname, '..', 'files', 'Yocto ERP.pdf');
    console.log(await addEmailQueue({
      from: 'info@yocto.erp',
      to: 'lephuoccanh@gmail.com',
      subject: 'testing send queue',
      message: 'testing send <strong>queue</strong>',
      attachments: [
        {type: EMAIL_ATTACHMENT_TYPE.ASSET, data: yoctoFile}
      ],
      bcc: 'nguyenhothu@gmail.com',
      cc: 'lephuoccanh@cartomat.com'
    }, 1, 2));
  })

  it('test process queue email', async () => {
    await emailQueueProcessing();
  })
});
