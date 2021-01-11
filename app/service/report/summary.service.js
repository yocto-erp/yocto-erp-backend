import db from '../../db/models';

const {Op, fn, col} = db.Sequelize;

export async function globalSummary(fromDate, toDate) {
  console.log(fromDate, toDate);
  const costSummary = await db.ReportCostDaily.findOne({
    attributes: [
      [fn('sum', col('receipt')), 'totalReceipt'],
      [fn('sum', col('payment')), 'totalPayment'],
      [fn('max', col('lastUpdated')), 'lastUpdated']
    ],
    raw: true,
    where: {
      reportDate: {
        [Op.and]: {
          [Op.gte]: fromDate,
          [Op.lte]: toDate
        }
      }
    }
  });

  return {
    costSummary
  }
}
