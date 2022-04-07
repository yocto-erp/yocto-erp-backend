import { hasText } from '../../util/string.util';
import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';
import { updateItemTags } from '../tagging/tagging.service';
import { TAGGING_TYPE } from '../../db/models/tagging/tagging-item-type';
import { auditAction } from '../audit/audit.service';
import { PERMISSION } from '../../db/models/acl/acl-action';
import { addTaggingQueue } from '../../queue/tagging.queue';
import { SUBJECT_TYPE } from '../../db/models/partner/subject';

const {Op} = db.Sequelize;

export function debts(user, query, {order, offset, limit}) {
  console.log(query);
  const {search} = query;
  const where = {companyId: user.companyId};
  if (hasText(search)) {
    where[Op.or] = [
      {
        remark: {
          [Op.like]: `%${search}%`
        }
      }
    ];
  }
  return db.Debt.findAndCountAll({
    where,
    // include: [
    //   {
    //     model: User,
    //     as: 'createdBy',
    //     attributes: ['id', 'displayName', 'email']
    //   },
    //   {
    //     model: User,
    //     as: 'lastModifiedBy',
    //     attributes: ['id', 'displayName', 'email']
    //   }
    // ],
    order,
    offset,
    limit
  })
}

export async function createDebt(user, createForm) {
  console.log('vaoooooooooooo');
  console.log(createForm);
  // const {
  //   type,
  //   company,
  //   person,
  //   remark,
  //   contactPerson,
  //   tagging
  // } = createForm;
  // const transaction = await db.sequelize.transaction();
  // try {
  //   let name;
  //   let gsm;
  //   let email;
  //   if (Number(type) === SUBJECT_TYPE.COMPANY) {
  //     // eslint-disable-next-line prefer-destructuring
  //     name = company.name;
  //     // eslint-disable-next-line prefer-destructuring
  //     gsm = company.gsm;
  //     // eslint-disable-next-line prefer-destructuring
  //     email = company.email;
  //   } else {
  //     name = `${person.firstName} ${person.lastName}`;
  //     // eslint-disable-next-line prefer-destructuring
  //     gsm = person.gsm;
  //     // eslint-disable-next-line prefer-destructuring
  //     email = person.email;
  //   }
  //
  //   const newSubject = await db.Subject.create({
  //     name,
  //     gsm, email,
  //     companyId: user.companyId,
  //     type: Number(type),
  //     subjectCompanyId: company?.id || 0,
  //     remark,
  //     personId: person?.id || 0,
  //     contactPersonId: contactPerson?.id || 0,
  //     createdDate: new Date(),
  //     lastActionedDate: new Date(),
  //     createdById: user.id,
  //   }, {transaction})
  //
  //   if (tagging && tagging.length) {
  //     await updateItemTags({
  //       id: newSubject.id,
  //       type: TAGGING_TYPE.SUBJECT,
  //       transaction,
  //       newTags: tagging
  //     });
  //   }
  //   await transaction.commit();
  //   auditAction({
  //     actionId: PERMISSION.CUSTOMER.CREATE,
  //     user,
  //     relativeId: String(newSubject.id)
  //   }).then();
  //   if (tagging && tagging.length) {
  //     addTaggingQueue([...new Set(tagging.map(t => t.id))]);
  //   }
  //
  //   return {
  //     ...newSubject.get({plain: true}),
  //     person,
  //     company
  //   };
  // } catch (e) {
  //   console.error(e)
  //   await transaction.rollback();
  //   if (e.name === 'SequelizeUniqueConstraintError') {
  //     throw badRequest('subject', FIELD_ERROR.EXISTED, 'Subject is existed')
  //   }
  //   throw e;
  // }
}
