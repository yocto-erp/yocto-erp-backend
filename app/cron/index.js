// import moment from "moment-timezone";
// import {schedulerLog} from "../config/winston_new";
//
// import {importCurrencyRate} from "../service/currency.service";
// import {calculateWeeklyBonusNew} from "../service/av-gift-week.service";
//
// const {CronJob} = require('cron');
//
// const TIMEZONE = 'Asia/Hong_Kong';
//
// // const startDate = new Date(2020, 2, 14, 23, 0, 0, 0);
// /**
//  * Cron run weekly at 0h AM 1s every wednesday
//  * @type {*|CronJob}
//  */
// export const weeklyWedBonusCron = new CronJob('05 00 03 * * 3', () => {
//   schedulerLog.info(`Process CalculateWeeklyBonus at ${moment().tz(TIMEZONE).format()}`);
//   return calculateWeeklyBonusNew();
// }, null, false, TIMEZONE);
//
// export const every5minUpdateBTCRate = new CronJob('00 */5 * * * *', () => {
//   schedulerLog.info(`Update BTC at ${moment().tz(TIMEZONE).format()}`);
//   return importCurrencyRate();
// });
//
//
// export function initCronTasks() {
//   schedulerLog.info('Start Weekly Bonus Crontab');
//   weeklyWedBonusCron.start();
//   schedulerLog.info(`Next run: ${weeklyWedBonusCron.nextDates()}`);
//   every5minUpdateBTCRate.start();
//   schedulerLog.info(`Next Run BTC update rate: ${every5minUpdateBTCRate.nextDates()}`);
// }
//

import {every5secondSendEmail} from "./email";
import {every5secondUploadBlockChain} from "./sync-blockchain";

export function initCronTasks() {
  every5secondSendEmail.start();
  every5secondUploadBlockChain.start();
}
