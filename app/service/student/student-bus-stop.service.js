import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';
import User from '../../db/models/user/user';
import { DEFAULT_INCLUDE_USER_ATTRS } from "../../db/models/constants";

const {Op} = db.Sequelize;

export function listStudentBusStop(user, query, {order, offset, limit}) {
  const {search} = query;
  let where = {
    companyId: user.companyId
  };
  if (search && search.length) {
    where = {
      ...where,
      name: {
        [Op.like]: `%${search}%`
      }
    }
  }
  return db.StudentBusStop.findAndCountAll({
    order,
    where,
    include: [
      {
        model: User, as: 'lastModifiedBy',
        attributes: DEFAULT_INCLUDE_USER_ATTRS
      }
    ],
    offset,
    limit
  });
}

export async function getStudentBusStop(user, wId) {
  const item = await db.StudentBusStop.findOne({
    where: {
      companyId: user.companyId,
      id: wId
    }
  });
  if (!item) {
    throw badRequest('busStop', FIELD_ERROR.INVALID, 'Bus Stop not found');
  }
  return item;
}

export function createStudentBusStop(user, createForm) {
  if (!user.companyId) {
    throw badRequest('companyId', FIELD_ERROR.INVALID, 'User have not company');
  }
  const {
    name
  } = createForm;
  return db.StudentBusStop.create(
    {
      name,
      companyId: user.companyId,
      lastModifiedById: user.id,
      lastModifiedDate: new Date()
    }
  )
}

export async function updateStudentBusStop(wId, user, updateForm) {
  const item = await getStudentBusStop(user, wId)
  const {
    name
  } = updateForm;
  item.name = name;
  item.lastModifiedDate = new Date();
  item.lastModifiedById = user.id;
  return item.save();
}

export async function removeStudentBusStop(user, wId) {
  const item = await getStudentBusStop(user, wId)
  return item.destroy();
}
