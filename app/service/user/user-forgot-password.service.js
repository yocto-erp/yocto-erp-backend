import md5 from 'md5';
import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';


export async function requestResetPassword(email) {
  const userInfo = await db.User.findOne(
    {where: {email: email}}
  );
  if (!userInfo) {
    throw badRequest('email', FIELD_ERROR.NOT_FOUND, 'Email Token');
  }
  const userResetPassInfo = await db.UserResetPassword.findOne({
    where: {user_id: userInfo.id}
  });
  const now = new Date();
  const expiredTime = now.setMinutes(now.getMinutes() + 30);
  const token = md5(`${email}-${new Date()}`);
  let rs = null;
  if (userResetPassInfo) {
    rs = await db.UserResetPassword.update(
      {
        expired_time: expiredTime,
        token,
        confirmed: false
      }, {
        where: {
          id: userResetPassInfo.id
        }
      });
  } else {
    rs = await db.UserResetPassword.create(
      {
        expired_time: expiredTime,
        token,
        user_id: userInfo.id,
        date_inserted: new Date(),
        confirmed: false
      });
  }
  if (!rs) {
    throw badRequest('reset', FIELD_ERROR.BAD_REQUEST, 'Cannot handle reset');
  }
  return token;
}

export async function isTokenValid(token) {
  const userPasswordReset = await db.UserResetPassword.findOne({
    where: {
      token,
      confirmed: false
    }
  });
  if (!userPasswordReset) {
    throw badRequest('token', FIELD_ERROR.BAD_REQUEST, 'Invalid Token');
  }
  const now = new Date();
  const expiredTime = new Date(userPasswordReset.expired_time);
  // maximum is 30 minutes
  if (now.getMilliseconds() - expiredTime.getMilliseconds() > 30 * 1800 * 1000) {
    throw badRequest('token', FIELD_ERROR.BAD_REQUEST, 'Token has expired. Please try to reset password again');
  }
  return userPasswordReset;
}


export async function updatePassword({token, password, rePassword}) {
  if (password !== rePassword) {
    throw badRequest('password', FIELD_ERROR.BAD_REQUEST, 'Password is not match with re password');
  }
  let rs = 0;
  const userPasswordReset = await isTokenValid(token);
  if (userPasswordReset) {
    await db.sequelize.transaction()
      .then(async (t) => {
        try {
          rs = await db.User.update({
              pwd: db.User.hashPassword(password)
            },
            {
              where: {
                id: userPasswordReset.user_id
              },
              transaction: t
            }
          );
          rs = await db.UserResetPassword.update(
            {
              confirmed: true
            },
            {
              where: {
                id: userPasswordReset.id
              },
              transaction: t
            });
          await t.commit();
        } catch (e) {
          await t.rollback();
          throw e;
        }
      });
  }
  return !!rs;
}
