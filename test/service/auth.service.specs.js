import { badRequest, FIELD_ERROR, FieldError, FormError } from '../../app/config/error';
import db from '../../app/db/models';
import { USER_STATUS } from '../../app/db/models/user/user';
import { appLog } from '../../app/config/winston';
import APP_CONFIG from '../../app/config/application';
import { ALL_PERMISSIONS } from '../../app/db/models/acl/acl-action';
import { ACTION_TYPE } from '../../app/db/models/acl/acl-group-action';

const jwt = require('jsonwebtoken');

const userNameFilter = ['admin', 'www', 'support', 'cryptocash', 'usd', 'ciphercore', 'ciphc', 'peak', 'addfund',
  'transfer', 'transaction', 'withdraw', 'username', 'password', 'package', 'order', 'amount', 'dashboard', 'menu',
  'genealogy', 'btc', 'class', 'profile', 'purchase', 'wallet', 'deposit', 'history', 'new', 'faq', 'av', 'gift', 'notice',
  'account', 'addfund', 'administrator', 'agent', 'amount', 'asset', 'bank', 'bitcoin', 'blockchain', 'BTC', 'business',
  'cash', 'ciphc', 'cipher', 'cipher-core', 'class', 'coin', 'company', 'crypto', 'cryptocash', 'dashboard', 'Deposit',
  'director', 'Download', 'email', 'Exchange', 'Fee', 'fin', 'forgot', 'freecode', 'fund', 'genealogy', 'gift',
  'history', 'joinus', 'login', 'manager', 'market', 'marketing', 'master', 'menu', 'money', 'nakamura', 'news',
  'newsletter', 'notice', 'nti', 'office', 'order', 'package', 'password', 'pay', 'Payment', 'peak', 'profile', 'purchase', 'sale', 'save',
  'shop', 'signup', 'sixpay', 'staff', 'support', 'system', 'takotoshi', 'token', 'transaction', 'transfer',
  'update', 'upload', 'USD', 'username', 'wallet', 'webmaster', 'webmaster', 'weboffice', 'Withdraw', 'Withdrawal'];
export async function registerTest(registerForm, transaction) {
  appLog.info(`${JSON.stringify(registerForm)}`);

  const currentUsername = await db.User.findOne({
    where: {email: registerForm.email}
  });
  if (currentUsername) {
    throw new FormError(
      new FieldError('email',
        FIELD_ERROR.INVALID,
        `email ${registerForm.email} is already taken`)
    );
  }

  if (userNameFilter.indexOf(registerForm.email.trim().toLowerCase()) >= 0) {
    throw new FormError(
      new FieldError('email',
        FIELD_ERROR.INVALID,
        `email ${registerForm.email} is not allow to register`)
    );
  }

  try {
    const group = await db.ACLGroup.create({
      name: 'COMPANY_GROUP',
      remark: 'Default group for master access',
      createdById: 0
    }, {transaction});
    const actions = ALL_PERMISSIONS.map(_p => {
      return {
        groupId: group.id,
        actionId: _p,
        type: ACTION_TYPE.FULL
      }
    });
    await db.ACLGroupAction.bulkCreate(actions, {transaction});

    return db.User.create(
      {
        email: registerForm.email,
        pwd: db.User.hashPassword(registerForm.password),
        displayName: registerForm.displayName,
        status: USER_STATUS.ACTIVE,
        insertedDate: new Date(),
        email_active: true,
        groupId: group.id
      },
      {transaction}
    );
  } catch (e) {
    appLog.error(e.message, e);
    throw e;
  }
}
export async function signInTest({email, password}) {
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
    throw badRequest('credential', FIELD_ERROR.INVALID, 'Email or password invalid');
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
  const token = jwt.sign(userJson, APP_CONFIG.JWT.secret);

  return {
    token,
    user: userJson
  };
}
