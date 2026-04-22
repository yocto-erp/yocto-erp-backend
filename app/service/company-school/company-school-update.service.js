import db from '../../db/models';

const { Op } = db.Sequelize;

export async function getCompanySchoolUpdate(user) {
  return db.CompanySchoolUpdate.findOne({
    where: {
      companyId: user.companyId,
    },
    order: [['id', 'DESC']],
  });
}

export async function getCompanySchoolUpdateById(id) {
  return db.CompanySchoolUpdate.findOne({
    where: {
      id: id
    },
    include: [
      {
        model: db.Company,
        as: 'company'
      }
    ]
  });
}

export async function saveCompanySchoolUpdate(user, form) {
  // eslint-disable-next-line no-return-await
  return await db.CompanySchoolUpdate.create({
    region: form.region,
    joinedDate: form.joinedDate,
    fullNameOwner: form.fullNameOwner,
    fullNameManage: form.fullNameManage,
    level: form.level,
    typeOrganization: form.typeOrganization,
    legalStructure: form.legalStructure,
    studentSize: form.studentSize,
    numberWorker: form.numberWorker,
    organizationalStructure: form.organizationalStructure,
    infoClass: form.infoClass,
    methodTeacher: form.methodTeacher,
    methodSchool: form.methodSchool,
    descriptionLastYear: form.descriptionLastYear,
    demandThisYear: form.demandThisYear,
    suggestion: form.suggestion,
    lastUpdated: new Date(),
    companyId: user.companyId,
  });
}

export function listCompanySchoolUpdate(user, query, { order, offset, limit }) {
  let where = {};
  if (query) {
    if (query.search && query.search.length) {
      where = {
        [Op.or]: [
          {
            fullNameOwner: {
              [Op.like]: `%${query.search}%`,
            },
          },
          {
            fullNameManage: {
              [Op.like]: `%${query.search}%`,
            },
          },
          {
            region: {
              [Op.like]: `%${query.search}%`,
            },
          },
          { '$company.name$': { [Op.like]: `%${query.search}%` } },
          { '$company.englishName$': { [Op.like]: `%${query.search}%` } }
        ],
      };
    }
  }
  // where.companyId = user.companyId;
  return db.CompanySchoolUpdate.findAndCountAll({
    order,
    where,
    offset,
    include: [
      {
        model: db.Company,
        as: 'company',
      },
    ],
    limit,
  });
}
