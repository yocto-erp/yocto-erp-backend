import db from '../db/models';
import {OTP_STATUS} from "../db/models/otp";
import {addHours} from "../util/date.util";
import {generateRandomUpperCode} from "../util/string.util";
import {buildTemplate, sendHtml} from "./email/email.service";
import {SYSTEM_CONFIG} from "../config/system";
import {badRequest} from "../config/error";

const {Op} = db.Sequelize;

export async function generateCode(clientId, target, type) {
  let existed = await db.OTP.findOne({
    where: {
      clientId, target, targetType: type,
      status: OTP_STATUS.PENDING,
      expiredDate: {
        [Op.gt]: addHours(new Date(), 24)
      }
    }
  });

  if (!existed) {
    const newCode = generateRandomUpperCode(6);
    existed = db.OTP.build({
      clientId, target, targetType: type, status: OTP_STATUS.PENDING,
      code: newCode,
      createdDate: new Date(),
      expiredDate: addHours(new Date(), 24)
    })
  }
  await existed.save();
  return existed.code;
}

export async function isValidCode(clientId, target, code) {
  const existed = await db.OTP.findOne({
    where: {
      clientId, target, code,
      status: OTP_STATUS.PENDING,
      expiredDate: {
        [Op.gt]: new Date()
      }
    }
  });

  if (!existed) {
    throw badRequest('code', 'INVALID', 'Invalid code');
  }
}

export async function sendSurveyEmailOtp(email, code, surveyName, surveyUrl) {
  const msg = await buildTemplate('join-survey', {
    code, surveyName, surveyUrl
  });
  const sendInfo = {
    from: SYSTEM_CONFIG.NOTIFY_NOTICE_EMAIL,
    to: email,
    subject: 'Survey Validation Code',
    html: msg
  };
  return sendHtml(sendInfo);
}
