import StudentClass from './student-class';
import StudentBusStop from './student-bus-stop';
import Student from './student';
import StudentMonthlyFee from './student-monthly-fee';
import StudentDailyTracking from './student-daily-tracking';
import StudentJoinClass from './student-join-class';

export const initStudentModel = sequelize => ({
  Student: Student.init(sequelize),
  StudentMonthlyFee: StudentMonthlyFee.init(sequelize),
  StudentClass: StudentClass.init(sequelize),
  StudentBusStop: StudentBusStop.init(sequelize),
  StudentDailyTracking: StudentDailyTracking.init(sequelize),
  StudentJoinClass: StudentJoinClass.init(sequelize)
});
