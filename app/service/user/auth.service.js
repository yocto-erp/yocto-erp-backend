import jwt from 'jsonwebtoken';
import md5 from 'md5';
import db from '../../db/models';
import { badRequest, FIELD_ERROR, FieldError, FormError, HTTP_ERROR, HttpError } from '../../config/error';
import {USER_STATUS} from '../../db/models/user/user';
import APP_CONFIG from '../../config/application';
import {appLog} from '../../config/winston';
import {USER_EVENT, userEmitter} from '../../event/user.event';
import {ALL_PERMISSIONS} from '../../db/models/acl/acl-action';
import {ACTION_TYPE} from '../../db/models/acl/acl-group-action';
import * as emailService from '../email/email.service';



const userNameFilter = ['admin', 'www', 'support', 'cryptocash', 'usd', 'ciphercore', 'ciphc', 'peak', 'addfund',
  'transfer', 'transaction', 'withdraw', 'password', 'package', 'order', 'amount', 'dashboard', 'menu',
  'genealogy', 'btc', 'class', 'profile', 'purchase', 'wallet', 'deposit', 'history', 'new', 'faq', 'av', 'gift', 'notice',
  'account', 'addfund', 'administrator', 'agent', 'amount', 'asset', 'bank', 'bitcoin', 'blockchain', 'BTC', 'business',
  'cash', 'ciphc', 'cipher', 'cipher-core', 'class', 'coin', 'company', 'crypto', 'cryptocash', 'dashboard', 'Deposit',
  'director', 'Download', 'email', 'Exchange', 'Fee', 'fin', 'forgot', 'freecode', 'fund', 'genealogy', 'gift',
  'history', 'joinus', 'login', 'manager', 'market', 'marketing', 'master', 'menu', 'money', 'nakamura', 'news',
  'newsletter', 'notice', 'nti', 'office', 'order', 'package', 'password', 'pay', 'Payment', 'peak', 'profile', 'purchase', 'sale', 'save',
  'shop', 'signup', 'sixpay', 'staff', 'support', 'system', 'takotoshi', 'token', 'transaction', 'transfer',
  'update', 'upload', 'USD', 'wallet', 'webmaster', 'webmaster', 'weboffice', 'Withdraw', 'email'];

export async function signIn({email, password}) {
  if (!email || email.length === 0 || !password || password.length === 0) {
    throw badRequest('credential', FIELD_ERROR.INVALID, 'Email or password invalid');
  }
  const user = await db.User.findOne({
    where: {
      email: email
    },
    include: [
      {model: db.ACLGroupAction, as: 'permissions'},
      {model: db.ACLGroupActionShop, as: 'shopPermissions'},
      {model: db.Company, as: 'userCompanies'}
    ]
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
    throw badRequest('credential', FIELD_ERROR.EMAIL_NOT_ACTIVE, 'User not active');
  }
  const userJson = user.get({plain: true});
  appLog.info(userJson);
  const {permissions, shopPermissions, userCompanies} = userJson;
  const userPermission = {};
  permissions.forEach(perm => {
    const {actionId, type} = perm;
    if (!userPermission[`action${actionId}`]) {
      userPermission[`action${actionId}`] = {type: type};
    }
  });
  shopPermissions.forEach(perm => {
    const {actionId, shopId} = perm;
    userPermission[`action${actionId}`].shopId = shopId;
  });

  let userCompany = null;
  if (userCompanies.length) {
    userCompany = userCompanies[0].id;
  }

  userJson.permissions = userPermission;
  userJson.userCompanies = userCompany;
  userJson.companyId = userCompany;
  const token = jwt.sign(userJson, APP_CONFIG.JWT.secret);

  return {
    token,
    user: userJson
  };
}

export async function register(registerForm) {
  appLog.info(`${JSON.stringify(registerForm)}`);

  const currentUsername = await db.User.findOne({
    where: {email: registerForm.email}
  });
  if (currentUsername) {
    throw new FormError(
      new FieldError('email',
        FIELD_ERROR.INVALID,
        `Email ${registerForm.email} is already taken`)
    );
  }

  if (userNameFilter.indexOf(registerForm.email.trim().toLowerCase()) >= 0) {
    throw new FormError(
      new FieldError('email',
        FIELD_ERROR.INVALID,
        `Email ${registerForm.email} is not allow to register`)
    );
  }

  return db.sequelize.transaction()
    .then(async (t) => {
      try {
        const group = await db.ACLGroup.create({
          name: 'COMPANY_GROUP',
          remark: 'Default group for master access',
          createdById: 0
        }, {transaction: t});
        const actions = ALL_PERMISSIONS.map(_p => {
          return {
            groupId: group.id,
            actionId: _p,
            type: ACTION_TYPE.FULL
          }
        });
        await db.ACLGroupAction.bulkCreate(actions, {transaction: t});

        const newUser = await db.User.create(
          {
            email: registerForm.email,
            pwd: db.User.hashPassword(registerForm.password),
            displayName: registerForm.displayName,
            status: USER_STATUS.ACTIVE,
            insertedDate: new Date(),
            email_active: false,
            groupId: group.id
          },
          {transaction: t}
        );

        await t.commit();
        appLog.info(`Send event user:register ${JSON.stringify(newUser)}`);

        if (process.env.NODE_ENV !== 'test') {
          userEmitter.emit(USER_EVENT.REGISTER, newUser);
        }


        return newUser;
      } catch (e) {
        appLog.error(e.message, e);
        await t.rollback();
        throw e;
      }
    });
}

export async function userExisted(email) {
  const currentUsername = await db.User.findOne({
    where: {email: email}
  });
  if (currentUsername) {
    throw new FormError(
      new FieldError('email',
        FIELD_ERROR.INVALID,
        `Email ${email} is already taken`)
    );
  }

  if (userNameFilter.indexOf(email.trim().toLowerCase()) >= 0) {
    throw new FormError(
      new FieldError('email',
        FIELD_ERROR.INVALID,
        `Email ${email} is not allow to register`)
    );
  }
}

export async function emailExisted(email) {
  const currentUser = await db.User.findOne({
    where: {
      email
    }
  });
  if (currentUser) {
    throw new FormError(
      new FieldError('email',
        FIELD_ERROR.INVALID,
        `Email ${email} is already taken`)
    );
  }
}

export async function confirmEmail(email, token) {
  appLog.info(`confirm email ${email} - ${token}`);
  const activeToken = await db.UserActivate.findOne({
    where: {
      active_code: token
    },
    order: [['date_inserted', 'DESC']]
  });
  if (!activeToken) {
    throw new HttpError(HTTP_ERROR.NOT_FOUND, 'Invalid Token');
  }
  const user = await db.User.findByPk(activeToken.user_id);
  if (!user || user.email !== email) {
    throw new HttpError(HTTP_ERROR.NOT_FOUND, 'Invalid Email');
  }
  await user.update({
    email_active: true
  });

  return user;
}

export async function resendEmailActive(email) {
  const user = await db.User.findOne({
    where: {
      email
    }
  });

  if (user) {
    try {
      const token = md5(`${user.email}-${new Date()}`);
      const url = `${process.env.WEB_URL || 'http://localhost:4200'}/email-activate?email=${user.email}&token=${token}`;

      return db.UserActivate.create({
        user_id: user.id,
        active_code: token,
        date_inserted: new Date()
      })
        .then(async () => {
          await emailService.sendRegister(user.email, user.displayName, url);
        });
    } catch (e) {
      appLog.error(e.message, e);
    }
  }
  return 0;
}

export async function createCompanyOnboard(user, createForm) {
  const transaction = await db.sequelize.transaction();
  try {
    const company = await db.Company.create(
      {
        name: createForm.name,
        gsm: createForm.gsm,
        address: createForm.address,
        remark: createForm.remark,
        createdDate: new Date(),
        createdById: user.id
      }, { transaction }
    );

    await db.UserCompany.create({
      userId: user.id,
      companyId: company.id
    }, {transaction});

    await transaction.commit();

    const userInform = await db.User.findOne({
      where: {
        id: user.id
      },
      include: [
        {model: db.ACLGroupAction, as: 'permissions'},
        {model: db.ACLGroupActionShop, as: 'shopPermissions'},
        {model: db.Company, as: 'userCompanies'}
      ]
    });
    const userJson = userInform.get({plain: true});
    appLog.info(userJson);
    const {permissions, shopPermissions, userCompanies} = userJson;
    const userPermission = {};
    permissions.forEach(perm => {
      const {actionId, type} = perm;
      if (!userPermission[`action${actionId}`]) {
        userPermission[`action${actionId}`] = {type: type};
      }
    });
    shopPermissions.forEach(perm => {
      const {actionId, shopId} = perm;
      userPermission[`action${actionId}`].shopId = shopId;
    });

    let userCompany = null;
    if (userCompanies.length) {
      userCompany = userCompanies[0].id;
    }
    userJson.permissions = userPermission;
    userJson.userCompanies = userCompany;
    userJson.companyId = userCompany;
    const token = jwt.sign(userJson, APP_CONFIG.JWT.secret);
    return { token };
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}
