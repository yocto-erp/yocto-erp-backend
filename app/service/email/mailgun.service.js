import {client} from 'mailgun.js';

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
      emailOpts.attachment = attachments.map(t => t.data)
    }
    return emailClient.messages.create(domain, emailOpts);
  };

  return {
    send
  }
}
