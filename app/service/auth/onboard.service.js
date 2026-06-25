import db from '../../db/models';
import { ACTION_TYPE } from '../../db/models/acl/acl-group-action';
import { USER_INVITE_STATUS } from '../../db/models/user/user-company';
import { COMPANY_CATEGORY } from '../../db/models/company/company';

export const userFirstOnboard = async ({ user, permissions, company: companyInfo }, transaction) => {
  const company = await db.Company.create(
    {
      name: '',
      createdDate: new Date(),
      category: companyInfo?.category || COMPANY_CATEGORY.NORMAL,
      createdById: user.id
    }, { transaction }
  );

  const group = await db.ACLGroup.create({
    name: 'COMPANY_GROUP',
    remark: 'Default group for master access',
    createdById: user.id,
    totalPermission: permissions.length
  }, { transaction });
  if (permissions.length > 0) {
    const actions = permissions.map(_p => {
      return {
        groupId: group.id,
        actionId: _p,
        type: ACTION_TYPE.FULL
      };
    });
    await db.ACLGroupAction.bulkCreate(actions, { transaction });
  }

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
