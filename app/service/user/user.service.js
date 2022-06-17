import md5 from "md5";
import db from "../../db/models";
import { badRequest, FIELD_ERROR } from "../../config/error";
import { USER_EVENT, userEmitter } from "../../event/user.event";
import { USER_INVITE_STATUS } from "../../db/models/user/user-company";
import { USER_STATUS } from "../../db/models/user/user";
import * as emailService from "../email/email.service";
import { differentHour } from "../../util/date.util";

const { Op } = db.Sequelize;

export function updatePassword(uId, newPwd) {
  return db.User.update(
    { password: db.User.hashPassword(newPwd) },
    { where: { id: uId } }
  );
}

export async function checkPassword(uId, pwd) {
  const user = await db.User.findOne({
    where: { id: uId },
    attributes: ["password"]
  });
  return db.User.comparePassword(pwd, user.password);
}

export function users(user, query, order, offset, limit) {
  const { search } = query;
  let where = {
    companyId: user.companyId,
    "$user.id$": {
      [Op.ne]: user.id
    }
  };
  where = {
    ...where,
    [Op.or]: [
      {
        "$user.displayName$": {
          [Op.like]: `%${search}%`
        }
      }, {
        "$user.email$": {
          [Op.like]: `%${search}%`
        }
      }
    ]
  };
  console.log(order);
  const mappingOrder = order.map(t => ([{
    model: db.User,
    as: "user"
  }, ...t]));
  return db.UserCompany.findAndCountAll({
    order: mappingOrder,
    where,
    offset,
    include: [
      { model: db.User, as: "user" },
      { model: db.ACLGroup, as: "group" }
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
      { model: db.User, as: "user" },
      { model: db.Company, as: "company" },
      {
        model: db.ACLGroup, as: "group"
      },
      { model: db.ACLGroupAction, as: "permissions" }
    ]
  });
  if (!findUser) {
    throw badRequest("user", FIELD_ERROR.INVALID, "user not found");
  }
  return {
    user: findUser.user, group: findUser.group, permissions: findUser.permissions,
    id: findUser.user.id, company: findUser.company
  };
}

export async function editUser(user, uId, permissions) {
  const rs = await getUser(user, uId);
  if (!rs || !rs.user || !rs.group) {
    throw badRequest("permission", FIELD_ERROR.INVALID, "permission not found");
  }
  const transaction = await db.sequelize.transaction();
  try {
    await db.ACLGroupAction.destroy({
      where: {
        groupId: rs.group.id
      }
    }, { transaction });
    const permissionsForm = [];
    for (let index = 0; index < permissions.length; index += 1) {
      const result = permissions[index];
      permissionsForm.push({
        groupId: rs.group.id,
        type: result.type,
        actionId: result.actionId ? result.actionId : result.id
      });
    }
    const details = await db.ACLGroupAction.bulkCreate(permissionsForm, { transaction });
    await transaction.commit();
    return details;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function removeUser(user, uId) {
  const userCompany = await db.UserCompany.findOne({
    userId: uId, companyId: user.companyId
  });
  if (!userCompany) {
    throw badRequest("user", FIELD_ERROR.INVALID, "user not found");
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
    });
    await db.UserCompany.destroy({
      where: { userId: uId, companyId: user.companyId }
    });
    await transaction.commit();
    return { id: uId };
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function inviteUser(origin, user, form) {
  console.log(user);
  const { emails, permissions } = form;
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
        }, { transaction });
      }
      const permissionKey = Object.keys(permissions);
      // eslint-disable-next-line no-await-in-loop
      const group = await db.ACLGroup.create({
        name: "COMPANY_GROUP",
        remark: `Default group for invite user ${existedUser.email}`,
        createdById: user.id,
        totalPermission: permissionKey.length
      }, { transaction });
      const actions = permissionKey.map(k => {
        const perm = permissions[k];
        return {
          groupId: group.id,
          actionId: perm.id,
          type: perm.type
        };
      });
      // eslint-disable-next-line no-await-in-loop
      await db.ACLGroupAction.bulkCreate(actions, { transaction });

      // eslint-disable-next-line no-await-in-loop
      await db.UserCompany.create({
        userId: existedUser.id,
        companyId: user.companyId,
        groupId: group.id,
        inviteStatus: USER_INVITE_STATUS.INVITED,
        invitedDate: new Date()
      }, { transaction });
      // eslint-disable-next-line no-await-in-loop
      rs.push(existedUser);
    }
    await transaction.commit();
    rs.forEach(t => userEmitter.emit(USER_EVENT.INVITE, origin, t, user.company));
    return rs;
  } catch (e) {
    console.error(e);
    await transaction.rollback();
    throw e;
  }
}

export async function verifyInvite({ email, token, companyId }) {
  // TODO: Not yet check for token time expired, now allow unlimited
  const userActive = await db.UserActivate.findOne({
    where: {
      active_code: token,
      [Op.or]: [
        { isConfirmed: false },
        {
          isConfirmed: {
            [Op.eq]: null
          }
        }
      ]
    },
    include: [
      { model: db.User, as: "user", required: true }
    ]
  });
  if (!userActive || userActive.user.email !== email) {
    throw badRequest("user", FIELD_ERROR.INVALID, "Invalid User Token");
  }
  const invitation = await db.UserCompany.findOne({
    where: {
      userId: userActive.user.id,
      companyId,
      inviteStatus: USER_INVITE_STATUS.INVITED
    },
    include: [
      { model: db.Company, as: "company" }
    ]
  });
  console.log(userActive.user, companyId, invitation);
  if (!invitation) {
    throw badRequest("user", FIELD_ERROR.INVALID, "Invalid Invitation");
  }

  return { userActive, invitation };
}

export async function resendInvite(user, userId, origin) {
  let existedActivate = await db.UserActivate.findOne({
    where: {
      user_id: userId,
      [Op.or]: [
        { isConfirmed: false },
        {
          isConfirmed: {
            [Op.eq]: null
          }
        }
      ]
    },
    include: [
      { model: db.User, as: "user", required: true }
    ],
    order: [["id", "desc"]]
  });
  let token = "";
  if (existedActivate) {
    if (existedActivate.lastResentDate && differentHour(existedActivate.lastResentDate, new Date()) < 24) {
      throw badRequest("RESEND", FIELD_ERROR.INVALID, "You had resent in 24h, please try again later");
    }
    token = existedActivate.active_code;
    existedActivate.lastResentDate = new Date();
    await existedActivate.save();
  } else {
    token = md5(`${existedActivate.user.email}-${new Date()}`);
    existedActivate = await db.UserActivate.create({
      user_id: existedActivate.user.id,
      active_code: token,
      date_inserted: new Date(),
      isConfirmed: false
    });
  }

  const company = await db.Company.findOne({
    where: {
      id: user.companyId
    }
  });
  const url = `${origin || process.env.WEB_URL}/invite-confirm?email=${existedActivate.user.email}&token=${token}&companyId=${company.id}`;
  await emailService.sendInviteUser(existedActivate.user.email, company.name, url);
  return existedActivate;
}

export async function confirmInvitation({ email, token, companyId, firstName, lastName, password }) {
  const checkInvitation = await verifyInvite({ email, token, companyId });
  const { userActive, invitation } = checkInvitation;
  const { user } = userActive;
  const transaction = await db.sequelize.transaction();
  try {
    if (user.status === USER_STATUS.INVITED && user.personId === null) {
      const person = await db.Person.create({
        firstName,
        lastName,
        email,
        createdById: 0,
        createdDate: new Date()
      }, { transaction });
      user.pwd = db.User.hashPassword(password);
      user.displayName = `${firstName} ${lastName}`;
      user.status = USER_STATUS.ACTIVE;
      user.email_active = true;
      user.personId = person.id;
      await user.save({ transaction });
    }
    invitation.inviteStatus = USER_INVITE_STATUS.CONFIRMED;
    invitation.confirmedDate = new Date();
    userActive.isConfirmed = true;
    userActive.confirmedDate = new Date();
    await userActive.save({ transaction });
    await invitation.save({ transaction });
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }

  return user;
}
