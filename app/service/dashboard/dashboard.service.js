import db from "../../db/models";
import { STUDENT_STATUS } from "../../db/models/student/student";
import { DEFAULT_TIMEZONE } from "../../util/date.util";
import { buildDateObjTimezoneRangeQuery } from "../../util/db.util";
import { STUDENT_DAILY_STATUS } from "../../db/models/student/student-daily-tracking";

export async function summaryStudentToday(user) {
  const countryTz = user.timezone || DEFAULT_TIMEZONE;
  const dateRange = buildDateObjTimezoneRangeQuery(new Date(), new Date(), countryTz);

  const totalStudent = await db.Student.count({
    where: {
      status: STUDENT_STATUS.ACTIVE,
      companyId: user.companyId
    }
  });
  const totalAbsentToday = await db.StudentDailyTracking.count({
    where: {
      companyId: user.companyId,
      status: STUDENT_DAILY_STATUS.ABSENT,
      trackingDate: dateRange
    }
  });
  return {
    total: totalStudent,
    present: totalStudent - totalAbsentToday,
    absent: totalAbsentToday
  };
}
