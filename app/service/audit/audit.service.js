import db from "../../db/models";

export function auditAction({
                              actionId,
                              name = "",
                              user,
                              partnerPersonId = 0,
                              partnerCompanyId = 0,
                              remark = "",
                              relativeId = "",
                              subject,
                              tracking = {}
                            }) {
  return db.Audit.create({
    actionId,
    name,
    userId: user.id,
    partnerCompanyId,
    partnerPersonId,
    remark,
    subjectId: subject?.id,
    createdDate: new Date(),
    companyId: user.companyId,
    relativeId,
    ip: tracking?.id,
    userAgent: tracking?.userAgent
  });
}

export function filter({ paging: { offset, limit, order }, user }) {
  const where = {
    companyId: user.companyId
  };

  return db.Audit.findAndCountAll({
    where,
    include: [
      {
        model: db.Subject, as: "subject", include: [
          { model: db.Person, as: "person" },
          { model: db.Company, as: "company" }
        ]
      },
      { model: db.User, as: "createdBy" }
    ],
    offset,
    limit,
    order
  });
}
