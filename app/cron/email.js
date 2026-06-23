import { emailQueueProcessing } from '../service/email/company-email.service';
import { schedulerLog } from '../config/winston';

const { CronJob } = require('cron');

export const every30secondSendEmail = new CronJob('*/10 * * * * *', () => {
  schedulerLog.info("Email Queue Processing");
  return emailQueueProcessing();
});
