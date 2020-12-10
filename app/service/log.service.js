import db from '../db/models';
import EmailSend from '../db/models/email/email-send';

const {Op} = db.Sequelize;

export function logEmail(user, query, order, offset, limit) {
  const {search, fromDate, toDate} = query;
  const where = {};
  let whereSendMail = {};
  if (fromDate || toDate || (search && search.length)) {
    if (fromDate && toDate) {
      whereSendMail.sent_date = {
        [Op.and]: {
          [Op.gte]: new Date(fromDate),
          [Op.lte]: new Date(toDate)
        }
      };
    } else if (fromDate) {
      whereSendMail.sent_date = {
        [Op.gte]: new Date(fromDate)
      };
    } else if (toDate) {
      whereSendMail.sent_date = {
        [Op.lte]: new Date(toDate)
      };
    }

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
    where.companyId = user.companyId;
  }
  return db.EmailCompany.findAndCountAll({
    order,
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
