import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';
import User from '../../db/models/user/user';
import Person from '../../db/models/person';

const { Op } = db.Sequelize;

export function search(user, query, order, offset, limit) {
  const { search } = query;
  let where = {
    companyId: user.companyId
  };
  if (search && search.length) {
    where = {
      ...where,
      personId: {
        [Op.like]: `%${search}%`
      }
    };
  }
  return db.Employee.findAndCountAll({
    order,
    where,
    include: [
      {
        model: User, as: 'createdBy',
        attributes: ['id', 'displayName', 'email']
      },
      {
        model: Person, as: 'person',
        attributes: ['id', 'firstName', 'lastName', 'name']
      },
    ],

    offset,
    limit
  });
}

export async function getEmployee(user, wId) {
  const employee = await db.Employee.findOne({
    where: {
      companyId: user.companyId,
      id: wId
    }
  });
  if (!employee) {
    throw badRequest('employee', FIELD_ERROR.INVALID, 'employee not found');
  }
  return employee;
}

export function createEmployee(user, createForm) {
  if (!user.companyId) {
    throw badRequest('companyId', FIELD_ERROR.INVALID, 'User have not company');
  }
  return db.Employee.create(
    {
      companyId: user.companyId,
      personId: createForm.personId,
      startedDate: user.startedDate,
      salary: createForm.salary,
      bio: createForm.bio,
      createdById: user.id,
      createdDate: new Date()
    }
  );
}

export async function updateEmployee(wId, user, updateForm) {
  const employee = await db.Employee.findByPk(wId);
  if (!employee) {
    throw badRequest('employee', FIELD_ERROR.INVALID, 'Employee not found');
  }
  employee.personId = updateForm.personId;
  employee.startedDate = updateForm.startedDate;
  employee.salary = updateForm.salary;
  employee.bio = updateForm.bio;
  employee.lastModifiedDate = new Date();
  employee.lastModifiedById = user.id;
  return employee.save();
}

export async function removeEmployee(wId) {
  const employee = await db.Employee.findByPk(wId);
  if (!employee) {
    throw badRequest('employee', FIELD_ERROR.INVALID, 'Employee not found');
  }
  return db.Employee.destroy({
    where: { id: employee.id }
  });
}


