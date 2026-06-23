import db from '../../../db/models';
import { CHALLENGE_STATUS } from '../../../db/models/auth/challenge';
import { differentHour, differentMin } from '../../../util/date.util';
import { appLog } from '../../../config/winston';

export const sendOTPEmail = async (challengeId, { email }) => {

  const transaction = await db.sequelize.transaction();
  try {
    const challengeOTP = await db.ChallengeOTP.findOne({
      where: {
        challengeId
      },
      lock: transaction.LOCK.UPDATE,
      transaction
    });
    if (!challengeOTP) {
      throw new Error('Invalid challenge otp');
    }
    const challenge = await db.Challenge.findOne({
      where: {
        id: challengeId
      }
    });
    if (!challenge || challenge.status !== CHALLENGE_STATUS.AVAILABLE) {
      throw new Error('Invalid challenge');
    }
    if (challenge.expiredDate && challenge.expiredDate <= new Date()) {
      throw new Error('Challenge expired');
    }
    if (challengeOTP.totalSent > 3 && differentHour(challengeOTP.lastSent, new Date()) < 24) {
      throw new Error('Challenge sent too much in 24h');
    }
    const distanceLastSent = differentMin(challengeOTP.lastSent, new Date());
    appLog.info(`Distance last sent: ${distanceLastSent}`);
    if (distanceLastSent < 5) {
      throw new Error('Challenge sent so fast in 5min');
    }
    appLog.info(`Send OTP to email: ${email}`);
    challengeOTP.totalSent += 1;
    challengeOTP.lastSent = new Date();
    await challengeOTP.save({ transaction });
    await transaction.commit();
    return challengeOTP;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
