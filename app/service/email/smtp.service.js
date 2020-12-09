import nodemailer from 'nodemailer';

export const EMAIL_ENCRYPTION = {
  TLS: 'TLS',
  SSL: 'SSL'
}

export const smtpClient = (configure) => {
  const {url, port, username, password, encryption} = configure;

  const emailClient = nodemailer.createTransport({
    host: url,
    port: Number(port),
    secure: encryption === EMAIL_ENCRYPTION.SSL, // upgrade later with STARTTLS
    auth: {
      user: username,
      pass: password
    }
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

    if (attachments && attachments.length) {
      emailOpts.attachments = attachments.map(t => ({
        path: t.data
      }))
    }

    return emailClient.sendMail(emailOpts);
  };
  return {
    send
  }
}
