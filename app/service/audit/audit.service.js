import db from '../../db/models';

export function auditAction({
                              actionId,
                              user,
                              partnerPersonId = 0,
                              partnerCompanyId = 0,
                              remark = '',
                              relativeId = '',
                              subject
                            }) {
  return db.Audit.create({
    actionId,
    userId: user.id,
    partnerCompanyId,
    partnerPersonId,
    remark,
    subjectId: subject?.id,
    createdDate: new Date(),
    companyId: user.companyId,
    relativeId
  });
}

export function filter({paging: {offset, limit, order}, user}) {
  const where = {
    companyId: user.companyId
  };

  return db.Audit.findAndCountAll({
    where,
    include: [
      {model: db.Person, as: 'partnerPerson'},
      {model: db.Subject, as: 'subject'},
      {model: db.Company, as: 'partnerCompany'},
      {model: db.User, as: 'createdBy'}
    ],
    offset,
    limit,
    order
  });
}
