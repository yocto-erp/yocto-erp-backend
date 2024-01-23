import Sequelize from 'sequelize';
import db from '../../../db/models';
import { USER_ATTR_VIEW } from '../../../db/models/user/user';
import { hasText } from '../../../util/string.util';

const { Op } = Sequelize;

export const listFormRegister = async (user, { search, status, form }, paging) => {
  console.log(form);
  const where = {};
  if (hasText(search)) {
    where[Op.or] = [
      { '$subject.name$': { [Op.like]: `%${search}%` } },
      { '$subject.email$': { [Op.like]: `%${search}%` } },
      { '$subject.gsm$': { [Op.like]: `%${search}%` } }
    ];
  }
  if (hasText(status) && +status > 0) {
    where.status = status;
  }
  if (form && form.id) {
    where.formId = form.id;
  }
  return db.FormRegister.findAndCountAll({
    where,
    include: [
      {
        model: db.Form, as: 'form', where: {
          companyId: user.companyId
        }
      },
      { model: db.User, as: 'createdBy', attributes: USER_ATTR_VIEW },
      { model: db.Subject, as: 'subject' }
    ],
    ...paging
  });
};
