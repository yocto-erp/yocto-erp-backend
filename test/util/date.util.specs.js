import moment from "moment-timezone";
import { DEFAULT_TIMEZONE, getHourRange, getHourRangeFromLastMin } from "../../app/util/date.util";

describe("Date Test", () => {
  it("getCurrentHour", async function getCurrentHourTest() {
    console.log(getHourRange());
  });
  it("getHourRangeFromLastMin", async function getHourRangeFromLastMinTest() {
    console.log(getHourRangeFromLastMin(41));
  });
  it("getStartDateInUtcOfTimezoneDate", async function getStartDateInUtcOfTimezoneDate() {
    console.log(moment(new Date()).tz(DEFAULT_TIMEZONE).startOf("date").toDate());
  });
  it("getEndDateUtcOfTimezoneDate", async function getEndDateUtcOfTimezoneDate() {
    console.log(moment(new Date()).tz(DEFAULT_TIMEZONE).endOf("date").toDate());
  });
});
