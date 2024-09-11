import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';
import { hasText } from '../../util/string.util';
import { MAIN_CONTACT_TYPE } from '../../db/models/student/student';
import { SUBJECT_CATEGORY } from '../../db/models/partner/subject';
import { getOrCreatePersonalSubject } from '../subject/subject.service';
import { DEFAULT_INCLUDE_USER_ATTRS } from '../../db/models/constants';

const { Op } = db.Sequelize;


export const getStudentJoinClass = ({studentId}) => {
  return db.StudentJoinClass.findAll({
    where: {
      studentId
    },
    include: [{model: db.StudentClass, as: "class", required: true}]
  }).then((t) => t.map((item) => item.class));
};
export const getStudentJoinClassByClass = ({studentId}) => {
  return db.StudentJoinClass.findAll({
    where: {
      classId: {
        [Op.in]: studentId
      }
    },
    include: [{model: db.StudentClass, as: "class", required: true}]
  }).then((t) => t.map((item) => item.studentId));
};
export async function students(query, order, offset, limit, user) {
  const { search, class: studentClass, status } = query;
  const where = {};
  let wherePerson = {};

  if (search && search.length) {
    wherePerson = {
      [Op.or]: [
        {
          "$child.firstName$": {
            [Op.like]: `%${search}%`
          }
        }, {
          "$child.lastName$": {
            [Op.like]: `%${search}%`
          }
        }, {
          alias: {
            [Op.like]: `%${search}%`
          }
        }, {
          studentId: {
            [Op.eq]: `${search}`
          }
        },
        {
          "$father.firstName$": {
            [Op.like]: `%${search}%`
          }
        }, {
          "$father.lastName$": {
            [Op.like]: `%${search}%`
          }
        },
        {
          "$mother.firstName$": {
            [Op.like]: `%${search}%`
          }
        }, {
          "$mother.lastName$": {
            [Op.like]: `%${search}%`
          }
        }
      ]
    };
  }
  where.companyId = user.companyId;
  // eslint-disable-next-line no-unused-vars
  let _listStudentId = new Set();
  if(studentClass) {
    const _studentClass = JSON.parse(studentClass)
    const listStudentId = []
    if (_studentClass && _studentClass.length > 0) {
      for (let i = 0; i < _studentClass.length; i++) {
        const data = _studentClass[i]
        // eslint-disable-next-line no-await-in-loop
        listStudentId.push(data?.id)
      }
      const listStudentJoinClass = await getStudentJoinClassByClass({
        studentId: listStudentId
      })
      _listStudentId = new Set(listStudentJoinClass)
      if (_listStudentId.size) {
        where.id = {
          [Op.in]: Array.from(_listStudentId)
        };
      } else {
        return {
          count: 0,
          rows: []
        };
      }
    }
  }
  if (hasText(status)) {
    where.status = Number(status);
  }
  console.log(order);
  const _order = order.map(t => {
    const [name, dir] = t;
    if (name === "name") {
      return [{
        model: db.Person, as: "child"
      }, "lastName", dir];
    }
    return t;
  });
  const listStudent = await db.Student.findAndCountAll({
    order: _order,
    where: { ...where, ...wherePerson },
    include: [
      {
        model: db.User, as: "createdBy",
        attributes: DEFAULT_INCLUDE_USER_ATTRS
      },
      {
        model: db.StudentBusStop, as: "toSchoolBusStop"
      },
      {
        model: db.StudentBusStop, as: "toHomeBusStop"
      },
      {
        model: db.Person, as: "child"
      },
      {
        model: db.Person, as: "father"
      },
      {
        model: db.Person, as: "mother"
      }
    ],
    offset,
    limit
  });
  const newRows = []
  for (let i = 0; i < listStudent?.rows?.length; i++) {
    const data = listStudent?.rows[i]
    const item = {
      ...data.dataValues,
      // eslint-disable-next-line no-await-in-loop
      classStudents: await getStudentJoinClass({studentId: data?.id})
    }
    newRows.push(item)
  }
  return {
    count: listStudent.count,
    rows: newRows
  }
}

export async function getStudent(sId, user) {
  const student = await db.Student.findOne({
    where: {
      id: sId,
      companyId: user.companyId
    },
    include: [
      {
        model: db.Person, as: "child"
      },
      {
        model: db.User, as: "createdBy"
      },
      {
        model: db.StudentBusStop, as: "toSchoolBusStop"
      },
      {
        model: db.StudentBusStop, as: "toHomeBusStop"
      },
      {
        model: db.StudentClass, as: "class"
      },
      {
        model: db.Person, as: "father"
      },
      {
        model: db.Person, as: "mother"
      },
      {
        model: db.StudentJoinClass,
        as: "classStudents",
        include: [
          {model: db.StudentClass, as: "class"}
        ]
      }
    ]
  });
  if (!student) {
    throw badRequest("student", FIELD_ERROR.INVALID, "student not found");
  }
  return student;
}

export async function createStudent(user, createForm) {
  const existedStudent = await db.Student.findOne({
    where: {
      studentId: createForm.studentId
    }
  });
  if (existedStudent) {
    throw badRequest("studentId", "EXISTED", "Student Id existed !");
  }
  const transaction = await db.sequelize.transaction();
  try {
    const splitFullName = createForm.fullName.trim().split(" ");
    let firstName = "";
    const lastName = splitFullName[splitFullName.length - 1];
    if (splitFullName.length > 1) {
      splitFullName.splice(splitFullName.length - 1, 1);
      firstName = splitFullName.join(" ");
    }

    const person = await db.Person.create(
      {
        firstName: firstName,
        lastName: lastName,
        fullName: createForm.fullName,
        birthday: createForm.birthday,
        sex: createForm.sex ? createForm.sex : null,
        createdById: user.id,
        createdDate: new Date()
      }, { transaction }
    );

    let mainContactSubject;
    if (Number(createForm.mainContact) === MAIN_CONTACT_TYPE.MOTHER) {
      mainContactSubject = await getOrCreatePersonalSubject(user, createForm.mother.id, SUBJECT_CATEGORY.PARENT);
    } else {
      mainContactSubject = await getOrCreatePersonalSubject(user, createForm.father.id, SUBJECT_CATEGORY.PARENT);
    }

    const student = await db.Student.create(
      {
        personId: person.id,
        companyId: user.companyId,
        studentId: createForm.studentId,
        alias: createForm.alias,
        joinDate: createForm.joinDate,
        status: createForm.status ? createForm.status : null,
        fatherId: createForm.father?.id,
        motherId: createForm.mother?.id,
        feePackage: createForm.feePackage ? createForm.feePackage : null,
        enableBus: createForm.enableBus ? createForm.enableBus : false,
        toSchoolBusStopId: createForm.toSchoolBusStop?.id,
        toHomeBusStopId: createForm.toHomeBusStop?.id,
        toSchoolBusRoute: createForm.toSchoolBusRoute,
        toHomeBusRoute: createForm.toHomeBusRoute,
        enableMeal: createForm.enableMeal ? createForm.enableMeal : false,
        // classId: createForm.class?.id,
        mainContact: createForm.mainContact,
        subjectId: mainContactSubject.id,
        createdById: user.id,
        createdDate: new Date()
      }, { transaction }
    );
    const classStudent = createForm?.classStudents.map((item) => {
      return {
        studentId: student.id,
        classId: item.id,
        createdDate: new Date()
      }
    })
    await db.StudentJoinClass.bulkCreate(classStudent, {transaction})
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
    throw badRequest("student", FIELD_ERROR.INVALID, "student not found");
  }

  const person = await db.Person.findOne({
    where: {
      id: student.personId
    }
  });
  if (!person) {
    throw badRequest("student", FIELD_ERROR.INVALID, "student not found");
  }
  const findStudentJoinClass = await db.StudentJoinClass.findOne({
    where: {
      studentId: student?.id
    }
  })

  const transaction = await db.sequelize.transaction();
  try {
    if (findStudentJoinClass) {
      await db.StudentJoinClass.destroy({
        where: {
          studentId: findStudentJoinClass?.studentId
        }
      }, {transaction})
    }
    const splitFullName = updateForm.fullName.trim().split(" ");
    let firstName = "";
    const lastName = splitFullName[splitFullName.length - 1];
    if (splitFullName.length > 1) {
      splitFullName.splice(splitFullName.length - 1, 1);
      firstName = splitFullName.join(" ");
    }

    await person.update({
      firstName: firstName,
      lastName: lastName,
      fullName: updateForm.fullName,
      birthday: updateForm.birthday,
      sex: updateForm.sex ? updateForm.sex : null
    }, { transaction });

    let mainContactSubject;
    if (Number(updateForm.mainContact) === MAIN_CONTACT_TYPE.MOTHER) {
      mainContactSubject = await getOrCreatePersonalSubject(user, updateForm.mother.id, SUBJECT_CATEGORY.PARENT);
    } else {
      mainContactSubject = await getOrCreatePersonalSubject(user, updateForm.father.id, SUBJECT_CATEGORY.PARENT);
    }
    const studentUpdate = await db.Student.update({
      personId: person.id,
      companyId: user.companyId,
      studentId: updateForm.studentId,
      alias: updateForm.alias,
      joinDate: updateForm.joinDate,
      status: updateForm.status ? updateForm.status : null,
      fatherId: updateForm.father?.id,
      motherId: updateForm.mother?.id,
      feePackage: updateForm.feePackage ? updateForm.feePackage : null,
      enableBus: updateForm.enableBus ? updateForm.enableBus : false,
      toSchoolBusStopId: updateForm.toSchoolBusStop?.id,
      toHomeBusStopId: updateForm.toHomeBusStop?.id,
      toSchoolBusRoute: updateForm.toSchoolBusRoute,
      toHomeBusRoute: updateForm.toHomeBusRoute,
      enableMeal: updateForm.enableMeal ? updateForm.enableMeal : false,
      // classId: updateForm.class?.id,
      mainContact: updateForm.mainContact,
      subjectId: mainContactSubject.id,
      lastModifiedById: user.id,
      lastModifiedDate: new Date()
    }, { where: { id: sId } }, { transaction });

    const classStudent = updateForm?.classStudents.map((item) => {
      return {
        studentId: student.id,
        classId: item?.id || item?.classId,
        createdDate: new Date()
      }
    })
    await db.StudentJoinClass.bulkCreate(classStudent, {transaction})

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
    throw badRequest("student", FIELD_ERROR.INVALID, "student not found");
  }

  const checkPerson = await db.Person.findOne({
    where: {
      id: checkStudent.personId
    }
  });
  if (!checkPerson) {
    throw badRequest("student", FIELD_ERROR.INVALID, "student not found");
  }
  const transaction = await db.sequelize.transaction();
  try {
    await db.StudentJoinClass.destroy({
      where: {
        studentId: checkStudent.id
      }
    }, {transaction})
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

