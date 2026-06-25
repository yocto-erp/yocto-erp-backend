import path from 'path';
import fs from 'fs';
import ExcelJS from 'exceljs';
import db from '../../db/models';
import { BIRTHDAY_FORMAT, formatDateTime } from '../template/template.util';
import { appLog } from '../../config/winston';
import { badRequest, FIELD_ERROR } from '../../config/error';

const { Op } = db.Sequelize;

export async function getCompanySchoolUpdate(user) {
  const rs = await db.CompanySchoolUpdate.findOne({
    where: {
      companyId: user.companyId
    },
    order: [['id', 'DESC']],
    raw: true
  });
  if (!rs) {
    throw badRequest('SCHOOL', FIELD_ERROR.INVALID, 'Not found any school information');
  }
  return {
    ...rs,
    level: rs.level ? JSON.parse(rs.level) : [],
    region: rs.region ? JSON.parse(rs.region) : []
  };
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
  return db.CompanySchoolUpdate.create({
    region: JSON.stringify(form.region),
    joinedDate: form.joinedDate ? form.joinedDate : null,
    fullNameOwner: form.fullNameOwner ? form.fullNameOwner : null,
    fullNameManage: form.fullNameManage ? form.fullNameManage : null,
    level: JSON.stringify(form.level),
    typeOrganization: form.typeOrganization ? form.typeOrganization : null,
    legalStructure: form.legalStructure ? form.legalStructure : null,
    studentSize: form.studentSize ? form.studentSize : null,
    numberWorker: form.numberWorker ? form.numberWorker : null,
    organizationalStructure: form.organizationalStructure ? form.organizationalStructure : null,
    infoClass: form.infoClass ? form.infoClass : null,
    methodTeacher: form.methodTeacher ? form.methodTeacher : null,
    methodSchool: form.methodSchool ? form.methodSchool : null,
    descriptionLastYear: form.descriptionLastYear ? form.descriptionLastYear : null,
    demandThisYear: form.demandThisYear ? form.demandThisYear : null,
    suggestion: form.suggestion ? form.suggestion : null,
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
  // where.companyId = user.companyId;
  return db.CompanySchoolUpdate.findAndCountAll({
    order,
    where,
    offset,
    include: [
      {
        model: db.Company,
        as: 'company'
      }
    ],
    limit
  });
}


const RENDER_FOLDER = path.resolve(__dirname, '..', '..', 'renderFolder');
if (!fs.existsSync(`${RENDER_FOLDER}/`)) {
  fs.mkdirSync(`${RENDER_FOLDER}/`);
}

export async function downloadCompanySchoolUpdate(
  user, query
) {

  const fileName = `list_school_${new Date().getTime()}.xlsx`;
  const fileSave = `${RENDER_FOLDER}/${fileName}`;
  const rs = {
    total: 0,
    success: 0,
    url: fileSave,
    fileName: fileName
  };

  const options = {
    filename: fileSave,
    useStyles: true,
    useSharedStrings: true
  };

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter(options);
  const worksheet = workbook.addWorksheet('Report');
  worksheet.columns = [
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
    if (query.ids && query.ids.length) {
      where.id = {
        [Op.in]: query.ids.split(',')
      };
    }
  }
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
      const {
        company, region, joinedDate, fullNameOwner, fullNameManage,
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
      } = listCompanySchool[i];
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
      worksheet.addRow(rowItem).commit();
      rs.success += 1;
    }
  }
  await workbook.commit();
  appLog.info(`Download list School ${JSON.stringify(rs)}`);
  return rs.url;
}

