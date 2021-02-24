import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';

const {Op} = db.Sequelize;

export function updatePassword(uId, newPwd) {
  return db.User.update(
    {password: db.User.hashPassword(newPwd)},
    {where: {id: uId}}
  );
}

export async function checkPassword(uId, pwd) {
  const user = await db.User.findOne({
    where: {id: uId},
    attributes: ['password']
  });
  return db.User.comparePassword(pwd, user.password);
}

export function users(user, query, order, offset, limit) {
  const {search} = query;
  let where = {};
  where = {
    ...where,
    [Op.or]: [
      {
        displayName: {
          [Op.like]: `%${search}%`
        }
      }, {
        email: {
          [Op.like]: `%${search}%`
        }
      }
    ]
  };
  return db.User.findAndCountAll({
    order,
    where,
    offset,
    limit
  });
}

export async function getUser(uId) {
  const findUser = await db.User.findOne({
    where: {
      id: uId
    }
  });
  if (!findUser) {
    throw badRequest('user', FIELD_ERROR.INVALID, 'user not found');
  }
  return findUser;
}

export async function removeUser(uId) {
  const user = await db.User.findByPk(uId);
  if (!user) {
    throw badRequest('user', FIELD_ERROR.INVALID, 'user not found');
  }
  return db.User.destroy({
    where: {id: user.id}
  });
}
