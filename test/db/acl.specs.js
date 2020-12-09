// import db from "../../app/db/models";
// import {ALL_PERMISSIONS} from "../../app/db/models/acl/acl-action";
// import {ACTION_TYPE} from "../../app/db/models/acl/acl-group-action";
//
// describe('acl', () => {
//   it('Create Company GROUP', async function createCompanyGroup() {
//     const group = await db.ACLGroup.create({
//       name: 'COMPANY_GROUP',
//       remark: 'Default group for master access',
//       createdById: 0
//     });
//     const actions = ALL_PERMISSIONS.map(t => {
//       return {
//         groupId: group.id,
//         actionId: t,
//         type: ACTION_TYPE.FULL
//       }
//     });
//     await db.ACLGroupAction.bulkCreate(actions);
//   });
// });
