import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';

const { Op } = db.Sequelize;

export async function getCompanyConfig(user) {
  const company = await db.Company.findByPk(user.companyId);
  const schoolUpdate = await db.CompanySchoolUpdate.findOne({
    where: {
      companyId: user.companyId
    },
    order: [['id', 'DESC']]
  });
  return {
    ...company.toJSON(),
    schoolUpdate: schoolUpdate
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
    facebook,
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
        [Op.ne]: user.companyId,
      },
    },
  });
  if (existedCompanyWithPublicId) {
    throw badRequest('publicId', FIELD_ERROR.EXISTED, 'Public Id existed');
  }
  existed.publicId = publicId;
  existed.name = name;
  existed.address = address;
  existed.remark = remark;
  existed.gsm = gsm;
  existed.establishedDate = establishedDate;
  existed.email = email;
  existed.website = website;
  existed.facebook = facebook;
  return existed.save();
}
