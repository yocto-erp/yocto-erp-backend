import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';
import User from '../../db/models/user/user';

const {Op} = db.Sequelize;

export function listStudentClass(user, query, {order, offset, limit}) {
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
  return db.StudentClass.findAndCountAll({
    order,
    where,
    include: [
      {
        model: User, as: 'lastModifiedBy',
        attributes: ['id', 'displayName', 'email']
      }
    ],
    offset,
    limit
  });
}

export async function getStudentClass(user, wId) {
  const item = await db.StudentClass.findOne({
    where: {
      companyId: user.companyId,
      id: wId
    }
  });
  if (!item) {
    throw badRequest('warehouse', FIELD_ERROR.INVALID, 'Student Class not found');
  }
  return item;
}

export function createStudentClass(user, createForm) {
  if (!user.companyId) {
    throw badRequest('companyId', FIELD_ERROR.INVALID, 'User have not company');
  }
  const {
    name, tuitionFeePerMonth,
    absentFeeReturnPerDay,
    feePerTrialDay,
    mealFeePerMonth,
    mealFeeReturnPerDay
  } = createForm;
  return db.StudentClass.create(
    {
      name,
      tuitionFeePerMonth,
      absentFeeReturnPerDay,
      feePerTrialDay,
      mealFeePerMonth,
      mealFeeReturnPerDay,
      companyId: user.companyId,
      lastModifiedById: user.id,
      lastModifiedDate: new Date()
    }
  )
}

export async function updateStudentClass(wId, user, updateForm) {
  const item = await getStudentClass(user, wId)
  const {
    name, tuitionFeePerMonth,
    absentFeeReturnPerDay,
    feePerTrialDay,
    mealFeePerMonth,
    mealFeeReturnPerDay
  } = updateForm;
  item.name = name;
  item.tuitionFeePerMonth = tuitionFeePerMonth;
  item.absentFeeReturnPerDay = absentFeeReturnPerDay;
  item.feePerTrialDay = feePerTrialDay;
  item.mealFeePerMonth = mealFeePerMonth;
  item.mealFeeReturnPerDay = mealFeeReturnPerDay;
  item.lastModifiedDate = new Date();
  item.lastModifiedById = user.id;
  return item.save();
}

export async function removeStudentClass(user, wId) {
  const item = await getStudentClass(user, wId)
  return item.destroy();
}
