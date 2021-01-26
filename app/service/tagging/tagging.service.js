import db from "../../db/models";
import {badRequest, FIELD_ERROR} from "../../config/error";

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
    include: [{
      model: db.User, as: 'createdBy'
    }],
    offset,
    limit
  });
}

export function readTagging(id, user) {
  return db.Tagging.findOne({
    where: {
      id, companyId: user.companyId
    }
  })
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

// eslint-disable-next-line no-unused-vars
export async function updateItemTags({id, type, newTags, oldTags, transaction}) {
  await db.TaggingItem.destroy({
    where: {
      itemType: type,
      itemId: id
    },
    transaction
  })
  if (newTags && newTags.length) {
    return db.TaggingItem.bulkCreate(newTags.map(t => ({
      taggingId: t.id,
      itemType: type,
      itemId: id
    })), {transaction});
  }
  return [];
}

export async function removeTagging(id, user) {
  const tagging = await db.Tagging.findOne({
    where: {
      id: id,
      companyId: user.companyId
    }
  });
  if (!tagging) {
    throw badRequest('tagging', FIELD_ERROR.INVALID, 'Tagging not found');
  }

  const transaction = await db.sequelize.transaction();
  try {
    await db.TaggingItem.destroy({
      where: {
        taggingId: id
      }
    }, {transaction});
    await tagging.destroy({transaction});
    await transaction.commit();
    return tagging;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

