import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';
import {USER_EVENT, userEmitter} from "../../event/user.event";
import {USER_INVITE_STATUS} from "../../db/models/user/user-company";
import {USER_STATUS} from "../../db/models/user/user";

const {Op} = db.Sequelize;

export function updatePassword(uId, newPwd) {
  return db.User.update(
    {password: db.User.hashPassword(newPwd)},
    {where: {id: uId}}
  );
}

export async function checkPassword(uId, pwd) {
  const user = await db.User.findOne({
    where: {id: uId},
    attributes: ['password']
  });
  return db.User.comparePassword(pwd, user.password);
}

export function users(user, query, order, offset, limit) {
  const {search} = query;
  let where = {
    companyId: user.companyId,
    '$user.id$': {
      [Op.ne]: user.id
    }
  };
  where = {
    ...where,
    [Op.or]: [
      {
        '$user.displayName$': {
          [Op.like]: `%${search}%`
        }
      }, {
        '$user.email$': {
          [Op.like]: `%${search}%`
        }
      }
    ]
  };
  console.log(order);
  const mappingOrder = order.map(t => ([{
    model: db.User,
    as: 'user'
  }, ...t]))
  return db.UserCompany.findAndCountAll({
    order: mappingOrder,
    where,
    offset,
    include: [
      {model: db.User, as: 'user'},
      {model: db.ACLGroup, as: 'group'}
    ],
    limit
  });
}

export async function getUser(user, uId) {
  const findUser = await db.UserCompany.findOne({
    where: {
      userId: uId,
      companyId: user.companyId
    },
    include: [
      {model: db.User, as: 'user'},
      {model: db.Company, as: 'company'},
      {
        model: db.ACLGroup, as: 'group'
      },
      {model: db.ACLGroupAction, as: 'permissions'}
    ]
  });
  if (!findUser) {
    throw badRequest('user', FIELD_ERROR.INVALID, 'user not found');
  }
  return {
    user: findUser.user, group: findUser.group, permissions: findUser.permissions,
    id: findUser.user.id, company: findUser.company
  };
}

export async function removeUser(user, uId) {
  const userCompany = await db.UserCompany.findOne({
    userId: uId, companyId: user.companyId
  });
  if (!userCompany) {
    throw badRequest('user', FIELD_ERROR.INVALID, 'user not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    await db.ACLGroupAction.destroy({
      where: {
        groupId: userCompany.groupId
      }
    });
    await db.ACLGroup.destroy({
      where: {
        id: userCompany.groupId
      }
    })
    await db.UserCompany.destroy({
      where: {userId: uId, companyId: user.companyId}
    });
    await transaction.commit();
    return {id: uId};
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function inviteUser(origin, user, form) {
  console.log(user);
  const {emails, permissions} = form;
  const rs = [];
  const transaction = await db.sequelize.transaction();
  try {
    for (let i = 0; i < emails.length; i += 1) {
      const email = emails[i];
      // eslint-disable-next-line no-await-in-loop
      let existedUser = await db.User.findOne({
        where: {
          email
        }
      });
      if (existedUser) {
        // eslint-disable-next-line no-await-in-loop
        const existedUserCompany = await db.UserCompany.findOne({
          where: {
            companyId: user.companyId,
            userId: existedUser.id
          }
        });
        if (existedUserCompany) {
          break;
        }
      } else {
        // eslint-disable-next-line no-await-in-loop
        existedUser = await db.User.create({
          email,
          createdDate: new Date(),
          email_active: false,
          createdById: user.id,
          status: USER_STATUS.INVITED
        }, {transaction})
      }
      const permissionKey = Object.keys(permissions);
      // eslint-disable-next-line no-await-in-loop
      const group = await db.ACLGroup.create({
        name: 'COMPANY_GROUP',
        remark: 'Default group for master access',
        createdById: user.id,
        totalPermission: permissionKey.length
      }, {transaction});
      const actions = permissionKey.map(k => {
        const perm = permissions[k];
        return {
          groupId: group.id,
          actionId: perm.id,
          type: perm.type
        }
      });
      // eslint-disable-next-line no-await-in-loop
      await db.ACLGroupAction.bulkCreate(actions, {transaction});

      // eslint-disable-next-line no-await-in-loop
      await db.UserCompany.create({
        userId: existedUser.id,
        companyId: user.companyId,
        groupId: group.id,
        inviteStatus: USER_INVITE_STATUS.INVITED,
        invitedDate: new Date()
      }, {transaction});
      // eslint-disable-next-line no-await-in-loop
      await transaction.commit();
      userEmitter.emit(USER_EVENT.INVITE, origin, existedUser, user.company);
      rs.push(email);
    }
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
  return rs;
}

export async function verifyInvite({email, token, companyId}) {
  const userActive = await db.UserActivate.findOne({
    where: {
      active_code: token
    },
    include: [
      {model: db.User, as: 'user', required: true}
    ]
  });
  if (!userActive || userActive.user.email !== email) {
    throw badRequest('user', FIELD_ERROR.INVALID, 'Invalid User Token');
  }
  const invitation = await db.UserCompany.findOne({
    where: {
      userId: userActive.user.id,
      companyId,
      inviteStatus: USER_INVITE_STATUS.INVITED
    },
    include: [
      {model: db.Company, as: 'company'},
    ]
  });
  console.log(userActive.user, companyId, invitation)
  if (!invitation) {
    throw badRequest('user', FIELD_ERROR.INVALID, 'Invalid Invitation');
  }

  return {userActive, invitation};
}

export async function confirmInvitation({email, token, companyId, firstName, lastName, password}) {
  const checkInvitation = await verifyInvite({email, token, companyId});
  const {userActive: {user}, invitation} = checkInvitation;
  const transaction = await db.sequelize.transaction();
  try {
    if (user.status === USER_STATUS.INVITED && user.personId === null) {
      const person = await db.Person.create({
        firstName,
        lastName,
        email,
        createdById: 0,
        createdDate: new Date()
      }, {transaction});
      user.pwd = db.User.hashPassword(password);
      user.displayName = `${firstName} ${lastName}`;
      user.status = USER_STATUS.ACTIVE;
      user.email_active = true;
      user.personId = person.id;
      await user.save({transaction});
    }
    invitation.inviteStatus = USER_INVITE_STATUS.CONFIRMED;
    await invitation.save({transaction});
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }

  return user;
}
