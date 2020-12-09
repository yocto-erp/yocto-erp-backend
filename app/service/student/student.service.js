import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';

const { Op } = db.Sequelize;

export function students(query, order, offset, limit, user) {
  const { search } = query;
  const where = {};
  let wherePerson = {};
  if (search && search.length) {
    wherePerson = {
      [Op.or]: [
        {
          firstName: {
            [Op.like]: `%${search}%`
          }
        }, {
          lastName: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    };
  }
  where.companyId = user.companyId;
  return db.Student.findAndCountAll({
    order,
    where,
    include: [
      {
        model: db.User, as: 'createdBy',
        attributes: ['id', 'displayName']
      },
      {
        model: db.Person, as: 'child',
        where: wherePerson
      },
      {
        model: db.Person, as: 'father',
        attributes: ['id', 'firstName', 'lastName', 'name']
      },
      {
        model: db.Person, as: 'mother',
        attributes: ['id', 'firstName', 'lastName', 'name']
      }
    ],
    offset,
    limit
  });
}

export async function getStudent(sId, user) {
  const student = await db.Student.findOne({
    where: {
      id: sId,
      companyId: user.companyId
    },
    include: [
      {
        model: db.Person, as: 'child'
      },
      {
        model: db.Person, as: 'father',
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: db.Person, as: 'mother',
        attributes: ['id', 'firstName', 'lastName']
      }
    ]
  });
  if (!student) {
    throw badRequest('student', FIELD_ERROR.INVALID, 'student not found');
  }
  return student;
}

export async function createStudent(user, createForm) {
  const transaction = await db.sequelize.transaction();
  try {
    const splitFullName = createForm.fullName.trim().split(' ');
    let firstName = '';
    const lastName = splitFullName[splitFullName.length - 1];
    if (splitFullName.length > 1) {
      splitFullName.splice(splitFullName.length - 1, 1);
      firstName = splitFullName.join(' ');
    }

    const person = await db.Person.create(
      {
        firstName: firstName,
        lastName: lastName,
        birthday: createForm.birthday,
        sex: createForm.sex ? createForm.sex : null,
        createdById: user.id,
        createdDate: new Date()
      }, { transaction }
    );

    const student = await db.Student.create(
      {
        personId: person.id,
        companyId: user.companyId,
        studentId: createForm.studentId,
        alias: createForm.alias,
        joinDate: createForm.joinDate,
        status: createForm.status ? createForm.status : null,
        fatherId: createForm.fatherId,
        motherId: createForm.motherId,
        feePackage: createForm.feePackage ? createForm.feePackage: null,
        enableBus: createForm.enableBus ? createForm.enableBus : false,
        toSchoolBusRoute: createForm.toSchoolBusRoute,
        toHomeBusRoute: createForm.toHomeBusRoute,
        enableMeal: createForm.enableMeal ? createForm.enableMeal: false,
        class: createForm.class,
        createdById: user.id,
        createdDate: new Date()

      }, { transaction }
    );
    await transaction.commit();
    return student;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function updateStudent(sId, updateForm, user) {
  const student = await db.Student.findOne({
    where: {
      id: sId,
      companyId: user.companyId
    }
  });
  if (!student) {
    throw badRequest('student', FIELD_ERROR.INVALID, 'student not found');
  }

  const person = await db.Person.findOne({
    where: {
      id: student.personId
    }
  });
  if (!person) {
    throw badRequest('student', FIELD_ERROR.INVALID, 'student not found');
  }


  const transaction = await db.sequelize.transaction();
  try {
    const splitFullName = updateForm.fullName.trim().split(' ');
    let firstName = '';
    const lastName = splitFullName[splitFullName.length - 1];
    if (splitFullName.length > 1) {
      splitFullName.splice(splitFullName.length - 1, 1);
      firstName = splitFullName.join(' ');
    }

    await person.update({
      firstName: firstName,
      lastName: lastName,
      birthday: updateForm.birthday,
      sex: updateForm.sex ? updateForm.sex : null
    }, transaction);

    const studentUpdate = await db.Student.update({
      personId: person.id,
      companyId: user.companyId,
      studentId: updateForm.studentId,
      alias: updateForm.alias,
      joinDate: updateForm.joinDate,
      status: updateForm.status ? updateForm.status: null,
      fatherId: updateForm.fatherId,
      motherId: updateForm.motherId,
      feePackage: updateForm.feePackage ? updateForm.feePackage: null,
      enableBus: updateForm.enableBus ? updateForm.enableBus : false,
      toSchoolBusRoute: updateForm.toSchoolBusRoute,
      toHomeBusRoute: updateForm.toHomeBusRoute,
      enableMeal: updateForm.enableMeal ? updateForm.enableMeal: false,
      class: updateForm.class,
      lastModifiedById: user.id,
      lastModifiedDate: new Date()
    }, {where: {id: sId}}, { transaction });

    await transaction.commit();
    return studentUpdate;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function removeStudent(sId, user) {
  const checkStudent = await db.Student.findOne({
    where: {
      id: sId,
      companyId: user.companyId
    }
  });
  if (!checkStudent) {
    throw badRequest('student', FIELD_ERROR.INVALID, 'student not found');
  }

  const checkPerson = await db.Person.findOne({
    where: {
      id: checkStudent.personId
    }
  });
  if (!checkPerson) {
    throw badRequest('student', FIELD_ERROR.INVALID, 'student not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    await db.Person.destroy({
      where: {
        id: checkPerson.id
      }
    }, { transaction });
    await db.Student.destroy({
      where: {
        id: sId
      }
    }, { transaction });
    await transaction.commit();
    return checkStudent;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

