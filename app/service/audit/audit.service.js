import db from '../../db/models';

export function auditAction({actionId, user, partnerPersonId = 0, partnerCompanyId = 0, remark = '', relativeId = ''}) {
  return db.Audit.create({
    actionId,
    userId: user.id,
    partnerCompanyId,
    partnerPersonId,
    remark,
    createdDate: new Date(),
    companyId: user.companyId,
    relativeId
  });
}

export function filter({paging: {offset, limit}, user}) {
  const where = {
    companyId: user.companyId
  };

  return db.Audit.findAndCountAll({
    order: [['createdDate', 'desc']],
    where,
    include: [
      {model: db.Person, as: 'partnerPerson'},
      {model: db.Company, as: 'partnerCompany'},
      {model: db.User, as: 'createdBy'}
    ],
    offset,
    limit
  });
}
