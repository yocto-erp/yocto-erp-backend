import {globalSummary} from "../../../app/service/report/summary.service";

describe('Summary', () => {
  it('globalSummary', async function globalSummaryTest() {
    console.log(await globalSummary(new Date('2020-09-21T07:00:00Z'), new Date('2020-11-05T05:00:00Z')))
  });
});
