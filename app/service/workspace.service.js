import db from "../db/models";
import { hasText } from "../util/string.util";
import { ALL_PERMISSIONS } from "../db/models/acl/acl-action";
import { ACTION_TYPE } from "../db/models/acl/acl-group-action";
import { USER_INVITE_STATUS } from "../db/models/user/user-company";

export function listWorkSpace(user, { search }, paging) {
  const where = {};
  if (hasText(search)) {
    where.name = {
      [db.Sequelize.Op.like]: `%${search}%`
    };
  }
  return db.UserCompany.findAndCountAll({
    where: {
      userId: user.id
    },
    include: [
      { model: db.Company, as: "company", where }
    ],
    ...paging
  });
}

export async function createWorkSpace(user, createForm) {
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

    const group = await db.ACLGroup.create({
      name: "COMPANY_GROUP",
      remark: "Default group for master access",
      createdById: 0,
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

    await db.UserCompany.create({
      userId: user.id,
      companyId: company.id,
      groupId: group.id,
      inviteStatus: USER_INVITE_STATUS.CONFIRMED
    }, { transaction });

    await transaction.commit();

    return company;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}
