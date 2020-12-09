import db from '../db/models';
import {TYPE} from '../db/models/system-property';

export const SYSTEM_CONFIG = {
  WITHDRAW_FEE: 0.03,
  FEE: {},
  WEB_OFFICE_FEE: 10,
  SYSTEM_CURRENCY: '',
  ADMIN_EMAIL: '',
  CALLING_CARD: 4000,
  PERIOD: 168,
  ESCROW_PERIOD: 6,
  LOAN_RATE: 0.03,
  BONUS_BLOCK_PERCENT: 0.3,
  BONUS_MATCHING_PERCENT: 0.1,
  WEB_EXPIRED_PERIOD: 28,
  NOTIFY_REGISTER_EMAIL: 'info@yoctoerp.com',
  NOTIFY_CHANGE_PASSWORD_EMAIL: 'info@yoctoerp.com',
  NOTIFY_WITHDRAW_EMAIL: 'info@yoctoerp.com',
  NOTIFY_ADD_FUND_EMAIL: 'info@yoctoerp.com',
  NOTIFY_KYC: 'info@yoctoerp.com',
  NOTIFY_AUTO_REPLY_EMAIL: 'info@yoctoerp.com',
  NOTIFY_NOTICE_EMAIL: 'info@yoctoerp.com',
  USD_GIFT_PERCENT: 0.65,
  CRYPTOCASH_GIFT_PERCENT: 0.35,
  KYC_FEE: 15,
  START_BUSINESS_DATE: '2020-04-10T03:00:00Z'
};

export function loadConfigure() {
  return db.SystemProperty.findAll().then(res => {
    res.forEach(item => {
      let {value} = item;
      switch (item.type) {
        case TYPE.NUMBER:
          value = Number(item.value);
          if (Number.isNaN(value)) {
            value = 0;
          }
          break;
        case TYPE.JSON:
          value = JSON.parse(item.value);
          break;
        default:
      }
      SYSTEM_CONFIG[item.name] = value;
    });
    return SYSTEM_CONFIG;
  });
}

export function update(name, value, type) {
  return db.SystemProperty.update({
    value: value,
    type: type
  }, {
    where: {
      name: name
    }
  });
}

