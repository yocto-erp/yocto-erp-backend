import { initWebStudentController } from "./student.controller";
import { initWebStudentMonthlyFeeController } from "./student-monthly-fee.controller";
import { initWebStudentBusStopController } from "./student-bus-stop.controller";
import { initWebStudentClassController } from "./student-class.controller";
import { initWebStudentTrackingController } from "./student-tracking.controller";
// eslint-disable-next-line import/named
import { initWebStudentMonthlyFeeNewController } from './student-monthly-fee-new.controller';

export function initStudentController(app) {
  initWebStudentController(app);
  initWebStudentMonthlyFeeController(app);
  initWebStudentBusStopController(app);
  initWebStudentClassController(app);
  initWebStudentTrackingController(app);
  initWebStudentMonthlyFeeNewController(app)
}
