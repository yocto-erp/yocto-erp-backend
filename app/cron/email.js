import { emailQueueProcessing } from '../service/email/company-email.service';
import { cronJobUpdateIPFSStatus, cronJobUploadIPFS } from '../service/asset/cloud.service';

const { CronJob } = require('cron');

export const every30secondSendEmail = new CronJob('*/10 * * * * *', () => {
  // schedulerLog.info("Email Queue Processing");
  return emailQueueProcessing();
});

export const every5minUploadToIPFS = new CronJob('0 */5 * * * *', () => {
  return cronJobUploadIPFS();
});

export const every10minUpdateIPFSStatus = new CronJob('0 */10 * * * *', () => {
  return cronJobUpdateIPFSStatus();
});
