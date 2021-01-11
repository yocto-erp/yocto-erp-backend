import {schedulerLog} from "../config/winston";
import {emailQueueProcessing} from "../service/email/company-email.service";

const {CronJob} = require('cron');

export const every5secondSendEmail = new CronJob('*/30 * * * * *', () => {
  schedulerLog.info('Email Queue Processing');
  return emailQueueProcessing();
});
