import {client} from 'mailgun.js';

const fs = require('fs');

export const mailgunClient = (configure) => {
  const {key, domain} = configure;
  const emailClient = client({
    username: 'api',
    key
  });
  const send = ({from, to, subject, html, bcc, cc, attachments}) => {
    const emailOpts = {
      from, to, subject, html
    };
    if (bcc) {
      emailOpts.bcc = bcc;
    }
    if (cc) {
      emailOpts.cc = cc;
    }

    if (attachments) {
      emailOpts.attachment = attachments.map(t => fs.createReadStream(t.data))
    }
    return emailClient.messages.create(domain, emailOpts);
  };

  return {
    send
  }
}
