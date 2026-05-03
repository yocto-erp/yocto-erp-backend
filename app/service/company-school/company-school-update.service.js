import path from 'path';
import fs from 'fs';
import db from '../../db/models';
import { writeFileStream } from '../../util/file.util';
import { BIRTHDAY_FORMAT, formatDateTime } from '../template/template.util';
import { appLog } from '../../config/winston';

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
    companyId: user.companyId
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


const RENDER_FOLDER = path.resolve(__dirname, "..", "..", "renderFolder");
if (!fs.existsSync(`${RENDER_FOLDER}/`)) {
  fs.mkdirSync(`${RENDER_FOLDER}/`);
}

const buildItemExport = async (companySchool) => {
  const {company, region, joinedDate, fullNameOwner, fullNameManage,
    level,
    typeOrganization,
    legalStructure,
    studentSize,
    numberWorker,
    organizationalStructure,
    infoClass,
    methodTeacher,
    methodSchool,
    descriptionLastYear,
    demandThisYear,
    suggestion} = companySchool;

  const rowItem = {
    name: company.name,
    englishName: company.englishName,
    gsm: company.gsm,
    email: company.email,
    address: company.address,
    remark: company.remark,
    establishedDate: formatDateTime(company.establishedDate, BIRTHDAY_FORMAT),
    website: company.website,
    facebook: company.facebook,
    region,
    joinedDate: formatDateTime(joinedDate, BIRTHDAY_FORMAT),
    fullNameOwner,
    fullNameManage,
    level,
    typeOrganization,
    legalStructure,
    studentSize,
    numberWorker,
    organizationalStructure,
    infoClass,
    methodTeacher,
    methodSchool,
    descriptionLastYear,
    demandThisYear,
    suggestion
  };
  return rowItem
}

export async function downloadCompanySchoolUpdate(
  user, query
) {
  console.log("query", query)
  const fileName = `list_school_${new Date().getTime()}.csv`;
  const fileSave = `${RENDER_FOLDER}/${fileName}`;
  const rs = {
    total: 0,
    success: 0,
    url: fileSave,
    fileName: fileName
  };
  const headers = [
    { header: 'Name', key: 'name' },
    { header: 'English Name', key: 'englishName' },
    { header: 'Phone Number', key: 'gsm' },
    { header: 'Email', key: 'email' },
    { header: 'Address', key: 'address' },
    { header: 'Remark', key: 'remark' },
    { header: 'Established Date', key: 'establishedDate' },
    { header: 'Website', key: 'website' },
    { header: 'facebook', key: 'facebook' },
    { header: 'region', key: 'region' },
    { header: 'Joined Date', key: 'joinedDate' },
    { header: 'Name Owner', key: 'fullNameOwner' },
    { header: 'Name Manager', key: 'fullNameManage' },
    { header: 'level', key: 'level' },
    { header: 'Organization', key: 'typeOrganization' },
    { header: 'Legal', key: 'legalStructure' },
    { header: 'Student Size', key: 'studentSize' },
    { header: 'Staff', key: 'numberWorker' },
    { header: 'Structure', key: 'organizationalStructure' },
    { header: 'Class Information', key: 'infoClass' },
    { header: 'Courses/Training', key: 'methodTeacher' },
    { header: 'Mentoring', key: 'methodSchool' },
    { header: 'Description Last Year', key: 'descriptionLastYear' },
    { header: 'Demand This Year', key: 'demandThisYear' },
    { header: 'Suggestion', key: 'suggestion' }
  ];

  let where = {};
  if (query) {
    if (query.search && query.search.length) {
      where = {
        [Op.or]: [
          {
            fullNameOwner: {
              [Op.like]: `%${query.search}%`
            }
          },
          {
            fullNameManage: {
              [Op.like]: `%${query.search}%`
            }
          },
          {
            region: {
              [Op.like]: `%${query.search}%`
            }
          },
          { '$company.name$': { [Op.like]: `%${query.search}%` } },
          { '$company.englishName$': { [Op.like]: `%${query.search}%` } }
        ]
      };
    }
  }

  const fileStream = fs.createWriteStream(fileSave, {flags: "a"});
  const headerRow = headers.map((t) => t.header).join(",");
  await writeFileStream(fileStream, `${headerRow}\n`);

  const listCompanySchool = await db.CompanySchoolUpdate.findAll({
    where,
    include: [
      {
        model: db.Company,
        as: 'company'
      }
    ]
  });
  rs.total = listCompanySchool.length;
  if (listCompanySchool.length) {
    for (let i = 0; i < listCompanySchool.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const rowItem = await buildItemExport(listCompanySchool[i]);
      // eslint-disable-next-line no-loop-func
      const dataRow = headers.map((t) => rowItem[t.key] || "").join(",");
      // eslint-disable-next-line no-await-in-loop
      await writeFileStream(fileStream, `${dataRow}\n`);
      rs.success += 1;
    }
  }
  appLog.info(`Download list School ${JSON.stringify(rs)}`);
  return rs.url;
}

