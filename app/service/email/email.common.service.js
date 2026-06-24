import { mailgunClient } from './mailgun.service';
import { smtpClient } from './smtp.service';

export const EMAIL_PROVIDER = {
  SMTP: 'SMTP',
  MAILGUN: 'MAILGUN'
};

export const getEmailClient = (configure) => {
  const { mailProvider } = configure;
  switch (mailProvider) {
    case EMAIL_PROVIDER.MAILGUN:
      return mailgunClient(configure);
    case EMAIL_PROVIDER.SMTP:
      return smtpClient(configure);
    default:
      throw new Error(`Not support email client ${mailProvider}`);
  }
};
