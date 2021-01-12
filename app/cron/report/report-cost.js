import db from '../../db/models'
import {getHourRange, getHourRangeFromLastMin} from "../../util/date.util";
import {sendErrorMessage} from "../../service/partner/telegram";
import {COST_TYPE} from "../../db/models/cost/cost";
import {schedulerLog} from "../../config/winston";

const {CronJob} = require('cron');

const {Op, fn, col} = db.Sequelize;
const RUNNING_MIN = 5;


export async function costSummary(from, to) {
  const where = {};
  if (from && to) {
    where.processedDate = {
      [Op.and]: {
        [Op.gte]: from,
        [Op.lte]: to
      }
    };
  }
  try {
    const rs = await db.Cost.findAll({
      attributes: [
        [fn('sum', col('amount')), 'total'],
        [fn('DATE_FORMAT', col('processedDate'), '%Y-%m-%dT%H:00:00.000Z'), 'date'],
        'companyId',
        'type'
      ],
      where,
      group: ['date', 'companyId', 'type'],
      raw: true
    });
    const reports = [];
    for (let i = 0; i < rs.length; i += 1) {
      const item = rs[i];
      let {companyId} = item;
      if (companyId === null) {
        companyId = 0;
      }
      let existReport = reports.find(t => t.reportDate.getTime() === new Date(item.date).getTime() && t.companyId === companyId);
      if (!existReport) {
        existReport = {
          reportDate: new Date(item.date),
          companyId: companyId,
          receipt: item.type === COST_TYPE.RECEIPT ? item.total : 0,
          payment: item.type === COST_TYPE.PAYMENT ? item.total : 0,
          lastUpdated: new Date()
        }
        reports.push(existReport);
      } else if (item.type === COST_TYPE.RECEIPT) {
        existReport.receipt = item.total;
      } else {
        existReport.payment = item.total;
      }
    }

    return db.ReportCostDaily.bulkCreate(reports, {
      updateOnDuplicate: ["receipt", "payment", "lastUpdated"]
    });
  } catch (e) {
    console.error(e);
    sendErrorMessage(e.stack).then();
  }
}

export function reportDailyCostSummary() {
  const lastHourRange = getHourRangeFromLastMin(RUNNING_MIN + 1);
  const currentHourRange = getHourRange();
  return costSummary(lastHourRange.begin, currentHourRange.end);
}

export const every15minUpdateHourlyCost = new CronJob('00 */5 * * * *', () => {
  schedulerLog.info('Running Report Cost Hourly Summary');
  return reportDailyCostSummary();
});
