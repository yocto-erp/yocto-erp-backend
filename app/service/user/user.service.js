import db from '../../db/models';

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
