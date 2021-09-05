import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';
import Employee from '../../db/models/employee/employee';
import ShiftWork from '../../db/models/shiftWork/shiftWork';
import User from '../../db/models/user/user';

const {Op} = db.Sequelize;

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
  return db.EmployeeTimesheet.findAndCountAll({
    order,
    where,
    include: [
      {
        model: ShiftWork, as: 'shift',
        attributes: ['id', 'name']
      },
      {
        model: Employee, as: 'company',
        attributes: ['companyID']
      },
      {
        model: Employee, as: 'employee',
        attributes : ['id']
      },
      {
        model: User, as: 'createdBy',
        attributes: ['id', 'displayName', 'email']
      },
    ],

    offset,
    limit
  });
}

export async function getTimesheet(user, wId) {
  const employeeTimesheet = await db.EmployeeTimesheet.findOne({
    where: {
      companyId: user.companyId,
      id: wId
    },
    include: [
      {
        model: ShiftWork, as: 'shift',
        attributes: ['id', 'name']
      },
      {
        model: Employee, as: 'company',
        attributes: ['companyID']
      },
      {
        model: Employee, as: 'employee',
        attributes : ['id']
      },
      {
        model: User, as: 'createdBy',
        attributes: ['id', 'displayName', 'email']
      },
    ],
  });
  if (!employeeTimesheet) {
    throw badRequest('employee', FIELD_ERROR.INVALID, 'employeeTimesheet not found');
  }
  return employeeTimesheet;
}

