import db from '../../db/models';
import { USER_INVITE_STATUS } from '../../db/models/user/user-company';
import { USER_STATUS } from '../../db/models/user/user';

/**
 * Build user company information, must make sure
 *  - user
 *  - company
 *  - groupId
 *  valid before using this function
 * @param user
 * @param company
 * @param groupId
 * @return {Promise<{email: *, displayName, avatarUrl, company: {name, publicId}, permissions: {}}>}
 */
export const buildUserCompanyInformation = async (user, company, groupId) => {
  const rs = {
    email: user.email,
    displayName: user.displayName || '',
    avatarUrl: user.avatarUrl || '',
    companyId: company.id,
    id: user.id,
    company: {
      name: company.name || '',
      publicId: company.publicId || ''
    },
    permissions: {}
  };

  const permissions = await db.ACLGroupAction.findAll({
    where: {
      groupId
    }
  });
  const userPermission = {};
  permissions.forEach(perm => {
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
  shopPermissions.forEach(perm => {
    const { actionId, shopId } = perm;
    userPermission[`action${actionId}`].shopId = shopId;
  });

  rs.permissions = userPermission;

  return rs;
};

/**
 * Using for check userId, companyId is invalid
 *  - user_company valid (status)
 *  - user valid
 *  - company valid
 * @param userId
 * @param companyId
 */
export const buildUserCompany = async ({userId, companyId}) => {
  const userCompany = await db.UserCompany.findOne({
    where: {
      userId: userId,
      companyId: companyId,
      inviteStatus: USER_INVITE_STATUS.CONFIRMED
    },
    include: [{
      model: db.User, as: 'user', where: {
        status: USER_STATUS.ACTIVE
      }
    }, {
      model: db.Company, as: 'company'
    }]
  })
  if(!userCompany){
    throw new Error('User company not found!');
  }
  return buildUserCompanyInformation(userCompany.user, userCompany.company, userCompany.groupId);
}
