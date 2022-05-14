import EventEmitter from "events";
import md5 from "md5";
import { eventLog } from "../config/winston";
import db from "../db/models";
import * as emailService from "../service/email/email.service";

export const USER_EVENT = Object.freeze({
  REGISTER: "user:register",
  INVITE: "user:invite"
});
export const userEmitter = new EventEmitter();

function emailRegister(user, origin) {
  try {
    const token = md5(`${user.email}-${new Date()}`);
    const url = `${origin || process.env.WEB_URL}/email-activate?email=${user.email}&token=${token}`;
    eventLog.info(`Build url: ${url}`);
    db.UserActivate.create({
      user_id: user.id,
      active_code: token,
      date_inserted: new Date(),
      isConfirmed: false
    })
      .then(async () => {
        await emailService.sendRegister(user.email, user.displayName, url);
      })
      .catch((reason) => {
        eventLog.error(reason);
      });
  } catch (e) {
    eventLog.error(e);
  }
}

function emailUserInvited(origin, user, company) {
  try {
    const token = md5(`${user.email}-${new Date()}`);
    const url = `${origin || process.env.WEB_URL}/invite-confirm?email=${user.email}&token=${token}&companyId=${company.id}`;
    db.UserActivate.create({
      user_id: user.id,
      active_code: token,
      date_inserted: new Date(),
      isConfirmed: false
    })
      .then(async () => {
        await emailService.sendInviteUser(user.email, company.name, url);
      })
      .catch((reason) => {
        eventLog.error(reason);
      });
  } catch (e) {
    eventLog.error(e);
  }
}

userEmitter.on(USER_EVENT.REGISTER, (user, origin) => {
  eventLog.info(`Event user:register ${JSON.stringify(user)}`);
  setImmediate(async () => {
    emailRegister(user, origin);
  });
});

userEmitter.on(USER_EVENT.INVITE, (origin, user, company) => {
  setImmediate(async () => {
    emailUserInvited(origin, user, company);
  });
});
