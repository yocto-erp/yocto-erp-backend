import db from "../../db/models";

const {Op} = db.Sequelize;

export function getListTags(query, order, offset, limit, user) {
  const {search} = query;
  const where = {};
  if (search && search.length) {
    where.label = {
      [Op.like]: `%${search}%`
    };
  }
  where.companyId = user.companyId;
  return db.Tagging.findAndCountAll({
    order,
    where,
    offset,
    limit
  });
}

export function createTag({label, color}, user) {
  return db.Tagging.create({
    label,
    color,
    companyId: user.companyId,
    total: 0,
    createdById: user.id,
    lastUpdatedDate: new Date()
  })
}

export async function updateItemTags({id, type, newTags, oldTags, transaction}) {
  await db.TaggingItem.destroy({
    where: {
      itemType: type,
      itemId: id
    },
    transaction
  })
  return db.TaggingItem.bulkCreate(newTags.map(t => ({
    taggingId: t.id,
    itemType: type,
    itemId: id
  })), {transaction})
}
