import {reportDailyCostCompany} from "../../../app/cron/report/report-cost";

describe('Cost Report', () => {
  it('hourly report', async function reportDailyCostCompanyTest() {
    console.log(await reportDailyCostCompany())
  });
});
