import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';

const {Op} = db.Sequelize;

export function companies(query, order, offset, limit, user) {
  const { search } = query;
  let where = {};
  if (search && search.length) {
    where = {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${search}%`
          }
        }, {
          gsm: {
            [Op.like]: `%${search}%`
          }
        },
        {
          address: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    };
  }

  return db.Company.findAndCountAll({
    order,
    where,
    include: [
      {
        model: db.User, as: 'createdBy',
        attributes: ['id', 'displayName']
      },
      {
        model: db.PartnerCompany, as: 'partnerCompany', where: { companyId: user.companyId }, attributes: []
      }
    ],
    offset,
    limit
  });
}

export async function getCompany(cId, user) {
  const company = await db.Company.findOne({
    where: {
      id: cId
    },
    include: {
      model: db.PartnerCompany, as: 'partnerCompany', where: { companyId: user.companyId }, attributes: []
    }
  });
  if (!company) {
    throw badRequest('company', FIELD_ERROR.INVALID, 'company not found');
  }
  return company;
}

export async function createCompany(user, createForm) {
  const transaction = await db.sequelize.transaction();

  try {
    const partnerCompany = await db.Company.create(
      {
        name: createForm.name,
        gsm: createForm.gsm,
        address: createForm.address,
        remark: createForm.remark,
        createdDate: new Date(),
        createdById: user.id
      }, { transaction }
    );

    await db.PartnerCompany.create({
      companyId: user.companyId,
      partnerCompanyId: partnerCompany.id
    }, {transaction})

    await transaction.commit();

    return partnerCompany;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function updateCompany(cId, updateForm, user) {
  const company = await db.Company.findOne({
    where: {
      id: cId
    },
    include: {
      model: db.PartnerCompany, as: 'partnerCompany', where: { companyId: user.companyId }, attributes: []
    }
  });
  if (!company) {
    throw badRequest('company', FIELD_ERROR.INVALID, 'company not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    await company.update({
      name: updateForm.name,
      gsm: updateForm.gsm,
      address: updateForm.address,
      remark: updateForm.remark
    }, transaction);

    await transaction.commit();
    return company;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function removeCompany(cId, user) {
  const checkCompany = await db.Company.findOne({
    where: {
      id: cId
    },
    include: { model: db.PartnerCompany, as: 'partnerCompany', where: { companyId: user.companyId }, attributes: [] }
  });
  if (!checkCompany) {
    throw badRequest('company', FIELD_ERROR.INVALID, 'company not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    await db.PartnerCompany.destroy({
      where: {
        companyId: user.companyId,
        partnerCompanyId: checkCompany.id
      }
    }, {transaction});
    const company = db.Company.destroy({
      where: { id: checkCompany.id }
    }, {transaction});
    await transaction.commit();
    return company;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
