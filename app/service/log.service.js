import db from '../db/models';
import EmailSend from '../db/models/email/email-send';
import {hasText} from "../util/string.util";
import {buildDateObjRangeQuery} from "../util/db.util";

const {Op} = db.Sequelize;

export function logEmail(user, query, order, offset, limit) {
  const {search, fromDate, toDate} = query;
  const where = {
    companyId: user.companyId
  };
  let whereSendMail = {};
  if (search && search.length) {
    whereSendMail = {
      [Op.or]: [
        {
          from: {
            [Op.like]: `%${search}%`
          }
        }, {
          to: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    };
  }
  if (hasText(fromDate) || hasText(toDate)) {
    const rangeDate = buildDateObjRangeQuery(fromDate, toDate)
    if (rangeDate != null) {
      whereSendMail.sent_date = rangeDate
    }
  }

  const _order = order.map(t => {
    if (t[0] === 'sent_date') {
      return [db.EmailSend, ...t]
    }
    return t
  })

  return db.EmailCompany.findAndCountAll({
    order: _order,
    where,
    include: [
      {
        model: EmailSend, as: 'email', where: whereSendMail
      }
    ],
    offset,
    limit
  }).then(t => {
    return {
      count: t.count,
      rows: t.rows.map(row => ({
        ...row.toJSON(),
        id: row.emailId
      }))
    }
  });
}
