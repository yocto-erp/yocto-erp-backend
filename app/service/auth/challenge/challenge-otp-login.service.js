import { Op } from 'sequelize';
import db from '../../../db/models';
import { CHALLENGE_ACTION, CHALLENGE_STATUS } from '../../../db/models/auth/challenge';
import { generateRandomCode, uuidV4 } from '../../../util/string.util';
import { addHours } from '../../../util/date.util';
import { sendOTPEmail } from './challenge-otp.service';
import { badRequest, FIELD_ERROR } from '../../../config/error';
import { USER_STATUS } from '../../../db/models/user/user';
import { getUserToken } from '../../user/auth.service';
import { appLog } from '../../../config/winston';

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

const getOrCreateUserWithEmail = async ({ email }, transaction) => {
  const rs = {
    user: null,
    isNew: false,
    userToken: null
  };

  rs.user = await db.User.findOne({
    where: {
      email
    },
    transaction
  });
  if (!rs.user) {
    rs.user = await db.User.create({
      email,
      displayName: '',
      createdDate: new Date(),
      email_active: true,
      status: USER_STATUS.ACTIVE,
      createdById: 0
    }, { transaction });
    rs.isNew = true;
  }
  rs.userToken = await getUserToken(rs.user);
  return rs;
};

export const confirmOTPLogin = async ({ challengePublicId, email, userAgent, ip, code }) => {
  appLog.info(`Confirm OTP Login with ${challengePublicId} - ${userAgent} - ${ip}`);
  const challenge = await db.Challenge.findOne({
    where: {
      publicId: challengePublicId,
      status: CHALLENGE_STATUS.AVAILABLE,
      expiredDate: {
        [Op.gt]: new Date()
      }
    }
  });
  if (!challenge) {
    throw badRequest('challenge', FIELD_ERROR.INVALID, `Invalid challenge ${challengePublicId}`);
  }
  const challengeOTPLogin = await db.ChallengeOtpLogin.findOne({
    where: {
      challengeId: challenge.id
    },
    include: [{
      model: db.ChallengeOTP, as: 'challengeOTP', required: true
    }]
  });
  if (!challengeOTPLogin) {
    throw badRequest('challenge', FIELD_ERROR.INVALID, 'Invalid challenge');
  }
  const { challengeOTP, email: challengeEmail } = challengeOTPLogin;
  if (challengeOTP.code !== code) {
    throw badRequest('challenge', FIELD_ERROR.INVALID, 'Invalid challenge code');
  }
  if (challengeEmail !== email) {
    throw badRequest('challenge', FIELD_ERROR.INVALID, 'Invalid challenge email');
  }

  const transaction = await db.sequelize.transaction();
  try {
    challenge.status = CHALLENGE_STATUS.CONFIRMED;
    challenge.confirmedOn = new Date();
    await challenge.save({ transaction });

    const confirmResponse = await getOrCreateUserWithEmail({ email }, transaction);
    // If userId not existed, then create new user with email
    await transaction.commit();
    return confirmResponse;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};
