import {schedulerLog} from "../config/winston";
import {getAllSurveyNotYetSync} from "../service/survey/survey.service";

const {CronJob} = require('cron');

export const every5secondUploadBlockChain = new CronJob('*/15 * * * * *', () => {
  schedulerLog.info('getAllSurveyNotYetSync Queue Processing');
  return getAllSurveyNotYetSync();
});
