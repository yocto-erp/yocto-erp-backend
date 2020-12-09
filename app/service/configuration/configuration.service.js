import db from '../../db/models';
import {VALUE_TYPE} from "../../db/models/company/company-configure";

const COMPANY_CONFIGURE_KEY = Object.freeze({
  EMAIL: 'EMAIL',
  STUDENT: 'STUDENT'
})

export async function getEmailConfigure(companyId) {
  const configure = await db.CompanyConfigure.findOne({
    where: {
      companyId,
      key: COMPANY_CONFIGURE_KEY.EMAIL
    }
  });
  if (configure) {
    return JSON.parse(configure.value);
  }
  return null;
}

export function saveEmailConfigure(companyId, configure) {
  return db.CompanyConfigure.upsert({
    companyId,
    key: COMPANY_CONFIGURE_KEY.EMAIL,
    value: JSON.stringify(configure),
    type: VALUE_TYPE.JSON
  })
}

export async function getStudentConfigure(companyId) {
  const value = {
    "numberDayOfMonth":0,
    "monthlyTuitionFee":0,
    "feePerDay":0,
    "feePerTrialDay":2,"mealFeePerDay":3,
    "busFee":0,
    "busRoutes":
      [{"id":"HOME","name":"Đường 2/9"},{"id":"SCHOOL","name":"Đường 30/4"}],
    "classes":[{"id":"1A","name":"1A"},{"id":"2A","name":"2A"}]}

  const configure = await db.CompanyConfigure.findOrCreate({
    where: {
      companyId,
      key: COMPANY_CONFIGURE_KEY.STUDENT
    },
    defaults: {
      companyId,
      key: COMPANY_CONFIGURE_KEY.STUDENT,
      value: JSON.stringify(value),
      type: VALUE_TYPE.JSON
    }
  });
  return JSON.parse(configure[0].value);
}

export function saveStudentConfigure(companyId, configure) {
  return db.CompanyConfigure.upsert({
    companyId,
    key: COMPANY_CONFIGURE_KEY.STUDENT,
    value: JSON.stringify(configure),
    type: VALUE_TYPE.JSON
  })
}

