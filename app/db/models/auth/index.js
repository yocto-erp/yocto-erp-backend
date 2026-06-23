import Challenge from './challenge';
import ChallengeOTP from './challenge-otp';
import ChallengeOtpLogin from './challenge-otp-login';

export const initChallengeModel = sequelize => ({
  Challenge: Challenge.init(sequelize),
  ChallengeOTP: ChallengeOTP.init(sequelize),
  ChallengeOtpLogin: ChallengeOtpLogin.init(sequelize)
});
