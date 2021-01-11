import {getHourRange, getHourRangeFromLastMin} from "../../app/util/date.util";

describe('Date Test', () => {
  it('getCurrentHour', async function getCurrentHourTest() {
    console.log(getHourRange());
  });
  it('getHourRangeFromLastMin', async function getHourRangeFromLastMinTest() {
    console.log(getHourRangeFromLastMin(41));
  });
});
