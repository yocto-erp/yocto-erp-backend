import db from '../../db/models'
import {badRequest, FIELD_ERROR} from '../../config/error';

const {Op} = db.Sequelize;

export function persons(query, order, offset, limit, user) {
  const {search} = query;
  let where = {};
  if (search && search.length) {
    where = {
      ...where,
      [Op.or]: [
        {
          firstName: {
            [Op.like]: `%${search}%`
          }
        }, {
          lastName: {
            [Op.like]: `%${search}%`
          }
        },
        {
          email: {
            [Op.like]: `%${search}%`
          }
        },
        {
          gsm: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    };
  }

  return db.PartnerPerson.findAndCountAll({
    where: {companyId: user.companyId},
    include: [
      {
        model: db.Person, required: true, where,
        order,
        include: [
          {
            model: db.User, as: 'createdBy',
            attributes: ['id', 'displayName', 'email']
          }
        ]
      }
    ],
    offset,
    limit
  }).then(t => {
    return {count: t.count, rows: t.rows.map(ps => ps.person)};
  });
}

export async function getPerson(pId, user) {
  const person = await db.Person.findOne({
    where: {
      id: pId
    },
    include: {model: db.PartnerPerson, as: 'partnerPerson', where: {companyId: user.companyId}, attributes: []}
  });
  if (!person) {
    throw badRequest('person', FIELD_ERROR.INVALID, 'person not found');
  }
  return person;
}

export async function createPerson(user, createForm) {
  const transaction = await db.sequelize.transaction();
  try {

    const person = await db.Person.create(
      {
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        fullName: `${createForm.firstName} ${createForm.lastName}`,
        gsm: createForm.gsm,
        email: createForm.email,
        address: createForm.address,
        birthday: createForm.birthday,
        sex: createForm.sex ? createForm.sex : null,
        remark: createForm.remark,
        createdById: user.id,
        createdDate: new Date()
      }, {transaction}
    );

    await db.PartnerPerson.create({
      companyId: user.companyId,
      personId: person.id
    }, {transaction})

    await transaction.commit();
    return person;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function updatePerson(pId, updateForm, user) {
  const person = await getPerson(pId, user)

  const transaction = await db.sequelize.transaction();
  try {
    await person.update({
      fullName: `${updateForm.firstName} ${updateForm.lastName}`,
      firstName: updateForm.firstName,
      lastName: updateForm.lastName,
      remark: updateForm.remark,
      gsm: updateForm.gsm,
      address: updateForm.address,
      email: updateForm.email,
      birthday: updateForm.birthday,
      sex: updateForm.sex || null
    }, transaction);

    await transaction.commit();
    return person;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function removePerson(pId, user) {
  const checkPerson = await getPerson(pId, user);
  const transaction = await db.sequelize.transaction();
  try {
    await db.PartnerPerson.destroy({
      where: {
        companyId: user.companyId,
        personId: checkPerson.id
      }
    }, {transaction});
    await db.PartnerCompanyPerson.destroy({
      where: {
        partnerCompanyId: user.companyId,
        personId: checkPerson.id
      }
    }, {transaction});
    const person = db.Person.destroy({
      where: {id: checkPerson.id}
    }, {transaction});
    await transaction.commit();
    return person;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

