import { hasText } from '../../util/string.util';
import { isArray } from '../../util/func.util';
import db from '../../db/models';
import User from '../../db/models/user/user';
import { taggingMapping } from '../tagging/tagging.service';

const {Op} = db.Sequelize;

export function debts(user, query, {order, offset, limit}) {
  console.log(query);
  const {tagging, search} = query;
  const where = {companyId: user.companyId};
  if (hasText(search)) {
    where[Op.or] = [
      {
        name: {
          [Op.like]: `%${search}%`
        }
      },
      {
        productDocumentId: {
          [Op.like]: `%${search}%`
        }
      }
    ];
  }
  const whereTagging = {};
  let isTaggingRequired = false;
  if (tagging && tagging.id) {
    whereTagging.taggingId = {
      [Op.in]: isArray(tagging.id) ? tagging.id : [tagging.id]
    };
    isTaggingRequired = true;
  }
  return db.Debt.findAndCountAll({
    attributes: ['id', 'name', 'remark', 'thumbnail', 'createdDate'],
    where,
    include: [
      {
        model: User,
        as: 'createdBy',
        attributes: ['id', 'displayName', 'email']
      },
      {
        model: User,
        as: 'lastModifiedBy',
        attributes: ['id', 'displayName', 'email']
      },
      {
        model: db.TaggingItem,
        required: isTaggingRequired,
        as: 'taggingItems',
        where: whereTagging,
        include: [
          {model: db.Tagging, as: 'tagging'}
        ]
      }
    ],
    order,
    offset,
    limit,
    group: ['id']
  }).then(async (resp) => {
    return ({
      count: resp.count.length,
      rows: resp.rows.map(item => taggingMapping(item.get({plain: true})))
    });
  });
}
