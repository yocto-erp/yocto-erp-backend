import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';
import {getShop} from "../shop/shop.service";

const {Op} = db.Sequelize;

export async function listPOS(user, query, {order, offset, limit}) {
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

  return db.POS.findAndCountAll({
    order,
    where,
    include: [
      {
        model: db.User, as: 'lastModifiedBy',
        attributes: ['id', 'displayName', 'email']
      },
      {model: db.WareHouse, as: 'warehouse'},
      {model: db.Shop, as: 'shop'}
    ],
    offset,
    limit
  });
}

export async function getPOS(user, wId) {
  const item = await db.POS.findOne({
    where: {
      companyId: user.companyId,
      id: wId
    },
    include: [
      {
        model: db.User, as: 'lastModifiedBy',
        attributes: ['id', 'displayName', 'email']
      },
      {model: db.WareHouse, as: 'warehouse'},
      {model: db.Shop, as: 'shop'}
    ]
  });
  if (!item) {
    throw badRequest('POS', FIELD_ERROR.INVALID, 'POS not found');
  }
  return item;
}

export async function createPOS(user, createForm) {
  if (!user.companyId) {
    throw badRequest('companyId', FIELD_ERROR.INVALID, 'User have not company');
  }
  return db.POS.create({
    name: createForm.name.trim(),
    remark: createForm.remark.trim(),
    companyId: user.companyId,
    warehouseId: createForm.warehouse?.id,
    shopId: createForm.shop?.id,
    lastModifiedById: user.id,
    lastModifiedDate: new Date()
  })
}

export async function updatePOS(user, wId, updateForm) {
  const pos = await getShop(user, wId)

  pos.name = updateForm.name.trim();
  pos.warehouseId = updateForm.warehouse?.id;
  pos.shopId = updateForm.shop?.id;
  pos.lastModifiedDate = new Date();
  pos.lastModifiedById = user.id;
  return pos.save();
}

export async function removePOS(user, wId) {
  const shop = await getShop(user, wId)
  return shop.destroy();
}

export async function getPosUser(user, posId) {
  const pos = await getPOS(user, posId);
  return db.PosUser.findAll({
    where: {
      posId: pos.id
    },
    include: [
      {model: db.User, as: 'user'}
    ]
  }).then(t => t.map(item => item.user))
}

export async function updatePosUser(user, posId, {users}) {
  const pos = await getPOS(user, posId);
  const transaction = await db.sequelize.transaction();
  try {
    await db.PosUser.destroy({
      where: {
        posId: pos.id
      }
    }, {transaction})
    const newPosUsers = users.map(t => ({
      posId: pos.id,
      userId: t.id
    }));
    pos.totalUser = newPosUsers.length;
    await pos.save({transaction})
    await db.PosUser.bulkCreate(newPosUsers, {transaction})
    await transaction.commit();
    return newPosUsers;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export function getListUserAssignPos(user) {
  console.log(user)
  return db.PosUser.findAll({
    where: {
      userId: user.id
    },
    include: [
      {
        model: db.POS, as: 'pos', required: true, where: {companyId: user.companyId},
        include: [
          {model: db.WareHouse, as: 'warehouse'},
          {model: db.Shop, as: 'shop'}
        ]
      }
    ]
  })
}

export async function isUserAssignPos(userId, posId) {
  const item = await db.PosUser.findOne({
    where: {
      userId, posId
    },
    include: [
      {model: db.POS, as: 'pos'}
    ]
  })
  if (!item) {
    throw badRequest('POS', FIELD_ERROR.INVALID, 'User have no permission to access POS')
  }
  return item.pos;
}
