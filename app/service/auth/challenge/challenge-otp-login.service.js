import { Op } from 'sequelize';
import db from '../../../db/models';
import { CHALLENGE_ACTION, CHALLENGE_STATUS } from '../../../db/models/auth/challenge';
import { generateRandomCode, uuidV4 } from '../../../util/string.util';
import { addHours } from '../../../util/date.util';
import { sendOTPEmail } from './challenge-otp.service';

/**
 * 1. Check email already have challenge (not expired) or create new one
 * 2. Send code to user email
 *  - If code not send more than 3 in 24hour
 *  - If last send not more than 5min
 * @param email
 * @param userAgent
 * @param IP
 */
export const createOTPLogin = async ({ email, userAgent, ip }) => {
  let existed = await db.ChallengeOtpLogin.findOne({
    where: {
      email
    },
    include: [{
      model: db.Challenge, as: 'challenge', where: {
        expiredDate: {
          [Op.lt]: new Date()
        },
        status: CHALLENGE_STATUS.AVAILABLE
      }
    }, {
      model: db.ChallengeOTP, as: 'challengeOTP', required: true
    }]
  });
  if (!existed) {
    existed = await db.ChallengeOtpLogin.create({
      email, challenge: {
        publicId: uuidV4(),
        createdDate: new Date(),
        expiredDate: addHours(new Date(), 24),
        status: CHALLENGE_STATUS.AVAILABLE,
        action: CHALLENGE_ACTION.LOGIN,
        ip, userAgent
      },
      challengeOTP: {
        code: generateRandomCode(6),
        totalSent: 0
      }
    }, {
      include: [
        {
          model: db.Challenge, as: 'challenge'
        }, {
          model: db.ChallengeOTP, as: 'challengeOTP'
        }
      ]
    });
  }
  return existed;
};

export const createOTPLoginAndSendEmail = async ({ email, userAgent, ip }) => {
  const challenge = await createOTPLogin({ email, userAgent, ip });
  try {
    await sendOTPEmail(challenge.challengeId, { email });
  } catch (err) {
    console.log(err);
  }
  return challenge;
};
