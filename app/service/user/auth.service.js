import md5 from 'md5';
import db from '../../db/models';
import {
  badRequest,
  FIELD_ERROR,
  FieldError,
  FormError,
  HTTP_ERROR,
  HttpError
} from '../../config/error';
import { USER_ORIGIN, USER_STATUS } from '../../db/models/user/user';
import { appLog } from '../../config/winston';
import { USER_EVENT, userEmitter } from '../../event/user.event';
import { ALL_PERMISSIONS } from '../../db/models/acl/acl-action';
import { ACTION_TYPE } from '../../db/models/acl/acl-group-action';
import * as emailService from '../email/email.service';
import { USER_INVITE_STATUS } from '../../db/models/user/user-company';
import { COMPANY_CATEGORY } from '../../db/models/company/company';
import { generateUserToken } from '../auth/jwt.service';
import { userFirstOnboard } from '../auth/onboard.service';
import { isEmailValid } from './constant';

async function getUserToken(userInform, selectCompanyId = null) {
  const userJson = userInform.get({ plain: true });

  /**
   * At the moment only support 1 user had one company, so default choose the first company
   */
  const userCompanies = userJson.userCompanies.filter(
    (t) => t.userCompany.inviteStatus === USER_INVITE_STATUS.CONFIRMED
  );

  userJson.userCompanies = userCompanies;
  userJson.companyId = null;
  let userCompany = null;
  let selectCompanyIndex = null;

  if (userCompanies.length === 1) {
    selectCompanyIndex = 0;
  } else if (userCompanies.length > 0) {
    if (selectCompanyId) {
      for (let i = 0; i < userCompanies.length; i += 1) {
        if (userCompanies[i].id === selectCompanyId) {
          selectCompanyIndex = i;
        }
      }
    }
    if (selectCompanyIndex === null) {
      selectCompanyIndex = 0;
    }
  }

  if (selectCompanyIndex != null) {
    userCompany = userCompanies[selectCompanyIndex];

    const {
      userCompany: { groupId }
    } = userCompany;
    const permissions = await db.ACLGroupAction.findAll({
      where: {
        groupId
      }
    });
    const userPermission = {};
    permissions.forEach((perm) => {
      const { actionId, type } = perm;
      if (!userPermission[`action${actionId}`]) {
        userPermission[`action${actionId}`] = { type: type };
      }
    });

    const shopPermissions = await db.ACLGroupActionShop.findAll({
      where: {
        groupId
      }
    });
    shopPermissions.forEach((perm) => {
      const { actionId, shopId } = perm;
      userPermission[`action${actionId}`].shopId = shopId;
    });

    userJson.permissions = userPermission;
    userJson.companyId = userCompany.id;
    userJson.company = userCompany;
  }


  return {
    token: await generateUserToken({
      userId: userJson.id,
      companyId: userJson.companyId
    }), user: userJson
  };
}

export async function selectCompany(user, companyId) {
  const existedUser = await db.User.findOne({
    where: {
      id: user.id
    },
    include: [
      {
        model: db.Company, as: 'userCompanies'
      },
      {
        model: db.Asset, as: 'avatar', include: [
          { model: db.AssetIpfs, as: 'ipfs' }
        ]
      }
    ]
  });
  existedUser.lastLogin = new Date();
  await existedUser.save();
  return getUserToken(existedUser, companyId);
}

export async function signIn({ email, password }) {
  if (!email || email.length === 0 || !password || password.length === 0) {
    throw badRequest('credential', FIELD_ERROR.INVALID, 'Email or password invalid');
  }
  const user = await db.User.findOne({
    where: {
      email: email
    },
    include: [
      {
        model: db.Company, as: 'userCompanies'
      },
      {
        model: db.Asset, as: 'avatar'
      }
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

  user.lastLogin = new Date();
  await user.save();
  return getUserToken(user);
}

export async function register(registerForm, origin) {
  appLog.info(`${JSON.stringify(registerForm)}`);

  const currentUsername = await db.User.findOne({
    where: { email: registerForm.email }
  });
  if (currentUsername && currentUsername.status !== USER_STATUS.INVITED) {
    throw new FormError(
      new FieldError(
        'email',
        FIELD_ERROR.INVALID,
        `Email ${registerForm.email} is already taken`
      )
    );
  }

  if (isEmailValid(registerForm.email)) {
    throw new FormError(
      new FieldError(
        'email',
        FIELD_ERROR.INVALID,
        `Email ${registerForm.email} is not allow to register`
      )
    );
  }

  const transaction = await db.sequelize.transaction();
  try {
    const person = await db.Person.create(
      {
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email,
        createdById: 0,
        createdDate: new Date()
      },
      { transaction }
    );

    let newUser;
    if (!currentUsername) {
      newUser = await db.User.create(
        {
          email: registerForm.email,
          pwd: db.User.hashPassword(registerForm.password),
          displayName: `${registerForm.firstName} ${registerForm.lastName}`,
          status: USER_STATUS.ACTIVE,
          createdDate: new Date(),
          email_active: false,
          personId: person.id,
          origin: USER_ORIGIN.NORMAL
        },
        { transaction }
      );
      await userFirstOnboard({ user: newUser, permissions: ALL_PERMISSIONS }, transaction);
    } else {
      currentUsername.pwd = db.User.hashPassword(registerForm.password);
      currentUsername.displayName = `${registerForm.firstName} ${registerForm.lastName}`;
      currentUsername.status = USER_STATUS.ACTIVE;
      currentUsername.personId = person.id;
      await currentUsername.save({ transaction });
      newUser = currentUsername;
    }

    await transaction.commit();

    if (process.env.NODE_ENV !== 'test') {
      userEmitter.emit(USER_EVENT.REGISTER, newUser, origin);
    }

    return newUser;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function registerSchool(registerForm, origin) {
  const currentUsername = await db.User.findOne({
    where: { email: registerForm.email }
  });
  if (currentUsername && currentUsername.status !== USER_STATUS.INVITED) {
    throw new FormError(
      new FieldError(
        'email',
        FIELD_ERROR.INVALID,
        `Email ${registerForm.email} is already taken`
      )
    );
  }

  if (isEmailValid(registerForm.email)) {
    throw new FormError(
      new FieldError(
        'email',
        FIELD_ERROR.INVALID,
        `Email ${registerForm.email} is not allow to register`
      )
    );
  }

  const transaction = await db.sequelize.transaction();
  try {
    const person = await db.Person.create(
      {
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email,
        createdById: 0,
        createdDate: new Date()
      },
      { transaction }
    );

    let newUser;
    if (!currentUsername) {
      newUser = await db.User.create(
        {
          email: registerForm.email,
          pwd: db.User.hashPassword(registerForm.password),
          displayName: `${registerForm.firstName} ${registerForm.lastName}`,
          status: USER_STATUS.ACTIVE,
          createdDate: new Date(),
          email_active: false,
          personId: person.id,
          origin: USER_ORIGIN.SCHOOL
        },
        { transaction }
      );
      await userFirstOnboard({
        user: newUser, permissions: [], company: {
          category: COMPANY_CATEGORY.SCHOOL
        }
      }, transaction);
    } else {
      currentUsername.pwd = db.User.hashPassword(registerForm.password);
      currentUsername.displayName = `${registerForm.firstName} ${registerForm.lastName}`;
      currentUsername.status = USER_STATUS.ACTIVE;
      currentUsername.personId = person.id;
      await currentUsername.save({ transaction });
      newUser = currentUsername;
    }

    await transaction.commit();

    if (process.env.NODE_ENV !== 'test') {
      userEmitter.emit(USER_EVENT.REGISTER, newUser, origin);
    }

    return newUser;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function confirmEmail(email, token) {
  appLog.info(`confirm email ${email} - ${token}`);
  const activeToken = await db.UserActivate.findOne({
    where: {
      active_code: token,
      isConfirmed: false
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

export async function resendEmailActive(email, origin) {
  const user = await db.User.findOne({
    where: {
      email
    }
  });

  if (user) {
    try {
      const token = md5(`${user.email}-${new Date()}`);
      const url = `${origin || 'http://localhost:4200'}/email-activate?email=${
        user.email
      }&token=${token}`;

      return db.UserActivate.create({
        user_id: user.id,
        active_code: token,
        date_inserted: new Date(),
        isConfirmed: false
      }).then(async () => {
        await emailService.sendRegister(
          user.email,
          user.displayName || user.email,
          url
        );
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
        englishName: createForm.englishName,
        createdDate: new Date(),
        createdById: user.id,
        category:
          USER_ORIGIN.NORMAL === Number(user.origin)
            ? COMPANY_CATEGORY.NORMAL
            : COMPANY_CATEGORY.SCHOOL
      },
      { transaction }
    );

    const group = await db.ACLGroup.create(
      {
        name: 'COMPANY_GROUP',
        remark: 'Default group for master access',
        createdById: 0,
        totalPermission:
          USER_ORIGIN.NORMAL === Number(user.origin)
            ? ALL_PERMISSIONS.length
            : 0
      },
      { transaction }
    );
    if (USER_ORIGIN.NORMAL === Number(user.origin)) {
      const actions = ALL_PERMISSIONS.map((_p) => {
        return {
          groupId: group.id,
          actionId: _p,
          type: ACTION_TYPE.FULL
        };
      });
      await db.ACLGroupAction.bulkCreate(actions, { transaction });
    }

    await db.UserCompany.create(
      {
        userId: user.id,
        companyId: company.id,
        groupId: group.id,
        inviteStatus: USER_INVITE_STATUS.CONFIRMED
      },
      { transaction }
    );

    await transaction.commit();

    const userInform = await db.User.findOne({
      where: {
        id: user.id
      },
      include: [
        {
          model: db.Company,
          as: 'userCompanies'
        }
      ]
    });

    return getUserToken(userInform);
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function onboardCompany(user, createForm) {
  await db.Company.update(
    {
      name: createForm.name,
      gsm: createForm.gsm,
      address: createForm.address,
      remark: createForm.remark,
      englishName: createForm.englishName,
      category:
        USER_ORIGIN.NORMAL === Number(user.origin)
          ? COMPANY_CATEGORY.NORMAL
          : COMPANY_CATEGORY.SCHOOL
    },
    {
      where: {
        id: user.companyId
      }
    }
  );


  return { ok: 1 };
}
