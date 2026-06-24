import { badRequest, FIELD_ERROR } from '../../config/error';
import db from '../../db/models';
import { USER_STATUS } from '../../db/models/user/user';
import { USER_INVITE_STATUS } from '../../db/models/user/user-company';
import { generateUserToken } from './jwt.service';
import { buildUserCompanyInformation } from './user-auth.common';

export async function userLogin({ email, password }) {
  if (!email || email.length === 0 || !password || password.length === 0) {
    throw badRequest('credential', FIELD_ERROR.INVALID, 'Email or password invalid');
  }
  const user = await db.User.findOne({
    where: {
      email: email
    },
    include: [
      {
        model: db.UserCompany, as: 'companies',
        where: {
          inviteStatus: USER_INVITE_STATUS.CONFIRMED
        },
        include: [{
          model: db.Company, as: 'company'
        }]
      },
      {
        model: db.Asset, as: 'avatar'
      }
    ],
    order: [[{ model: db.UserCompany, as: 'companies' }, 'companyId', 'ASC']]
  });

  if (!user) {
    throw badRequest('credential', FIELD_ERROR.INVALID, 'Email or password invalid');
  }
  if (!db.User.comparePassword(password, user.pwd)) {
    throw badRequest('credential', FIELD_ERROR.INVALID, 'Password is invalid');
  }
  if (!user.email_active) {
    throw badRequest('credential', FIELD_ERROR.EMAIL_NOT_ACTIVE, 'Email not active');
  }
  if (user.status !== USER_STATUS.ACTIVE) {
    throw badRequest('credential', FIELD_ERROR.INVALID, 'User not active');
  }

  user.lastLogin = new Date();
  await user.save();
  const { companies } = user;
  const userCompany = companies[0];
  const { company, groupId } = userCompany;
  return {
    token: await generateUserToken({ userId: user.id, companyId: company.id }),
    user: await buildUserCompanyInformation(user, company, groupId)
  };
}
