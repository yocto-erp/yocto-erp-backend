import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';
import { mappingSchool } from '../company-school/company-school-update.service';

const { Op } = db.Sequelize;

export async function getCompanyConfig(user) {
  const company = await db.Company.findByPk(user.companyId);
  const schoolUpdate = await db.CompanySchoolUpdate.findOne({
    where: {
      companyId: user.companyId
    },
    order: [['id', 'DESC']],
    raw: true
  });
  return {
    ...company.toJSON(),
    schoolUpdate: schoolUpdate ? mappingSchool(schoolUpdate) : null
  };
}

export async function saveCompanyConfig(
  user,
  {
    gsm,
    publicId,
    address,
    remark,
    name,
    establishedDate,
    email,
    website,
    facebook
  }
) {
  const existed = await getCompanyConfig(user);
  if (!existed) {
    throw badRequest('company', FIELD_ERROR.INVALID, 'Invalid company');
  }
  const existedCompanyWithPublicId = await db.Company.findOne({
    where: {
      publicId,
      id: {
        [Op.ne]: user.companyId
      }
    }
  });
  if (existedCompanyWithPublicId) {
    throw badRequest('publicId', FIELD_ERROR.EXISTED, 'Public Id existed');
  }

  // eslint-disable-next-line no-return-await
  return await db.Company.update({
    publicId: publicId,
    name: name,
    address: address,
    remark: remark,
    gsm: gsm,
    establishedDate: establishedDate,
    email: email,
    website: website,
    facebook: facebook
  }, {
    where: {
      id: user.companyId
    }
  });
}
