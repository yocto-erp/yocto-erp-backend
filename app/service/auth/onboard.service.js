import db from '../../db/models';
import { ALL_PERMISSIONS } from '../../db/models/acl/acl-action';
import { ACTION_TYPE } from '../../db/models/acl/acl-group-action';
import { USER_INVITE_STATUS } from '../../db/models/user/user-company';

export const userFirstOnboard = async (user, transaction) => {
  const company = await db.Company.create(
    {
      name: '',
      createdDate: new Date(),
      createdById: user.id
    }, { transaction }
  );

  const group = await db.ACLGroup.create({
    name: 'COMPANY_GROUP',
    remark: 'Default group for master access',
    createdById: user.id,
    totalPermission: ALL_PERMISSIONS.length
  }, { transaction });
  const actions = ALL_PERMISSIONS.map(_p => {
    return {
      groupId: group.id,
      actionId: _p,
      type: ACTION_TYPE.FULL
    };
  });
  await db.ACLGroupAction.bulkCreate(actions, { transaction });

  const userCompany = await db.UserCompany.create({
    userId: user.id,
    companyId: company.id,
    groupId: group.id,
    inviteStatus: USER_INVITE_STATUS.CONFIRMED
  }, { transaction });
  return {
    userCompany,
    company
  };
};
