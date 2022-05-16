import db from "../../db/models";
import { badRequest, FIELD_ERROR } from "../../config/error";
import User from "../../db/models/user/user";
import { DEFAULT_INCLUDE_USER_ATTRS } from "../../db/models/constants";
import { isArrayHasLength } from "../../util/func.util";

const { Op } = db.Sequelize;

export async function shops(user, query, order, offset, limit) {
  const { search } = query;
  let where = {
    companyId: user.companyId
  };
  if (search && search.length) {
    where = {
      ...where,
      name: {
        [Op.like]: `%${search}%`
      }
    };
  }

  return db.Shop.findAndCountAll({
    order,
    where,
    include: [
      {
        model: User, as: "createdBy",
        attributes: DEFAULT_INCLUDE_USER_ATTRS
      }
    ],
    offset,
    limit
  });
}

export async function getShop(user, wId) {
  const shop = await db.Shop.findOne({
    where: {
      companyId: user.companyId,
      id: wId
    },
    include: [
      {
        model: db.User, as: "users",
        attributes: DEFAULT_INCLUDE_USER_ATTRS
      }
    ]
  });
  if (!shop) {
    throw badRequest("shop", FIELD_ERROR.INVALID, "Shop not found");
  }
  return shop;
}

export async function createShop(user, createForm) {
  if (!user.companyId) {
    throw badRequest("companyId", FIELD_ERROR.INVALID, "User have not company");
  }
  const { users } = createForm;
  const transaction = await db.sequelize.transaction();
  try {
    const shop = await db.Shop.create(
      {
        name: createForm.name.trim(),
        address: createForm.address.trim(),
        phone: createForm.phone ? createForm.phone.trim() : "",
        companyId: user.companyId,
        createdById: user.id,
        createdDate: new Date(),
        totalUser: users?.length || 0
      }, { transaction }
    );
    if (isArrayHasLength(users)) {
      await db.UserShop.bulkCreate(users.map(t => ({
        shopId: shop.id,
        userId: t.id
      })), { transaction });
    }
    await transaction.commit();
    return shop;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }

}

export async function updateShop(wId, user, updateForm) {
  const shop = await getShop(user, wId);
  const { users } = updateForm;
  const transaction = await db.sequelize.transaction();
  try {
    shop.name = updateForm.name;
    shop.address = updateForm.address;
    shop.phone = updateForm.phone;
    shop.lastModifiedDate = new Date();
    shop.lastModifiedById = user.id;
    shop.totalUser = users?.length || 0;
    await db.UserShop.destroy({
      where: {
        shopId: shop.id
      }
    }, { transaction });

    if (isArrayHasLength(users)) {
      await db.UserShop.bulkCreate(users.map(t => ({
        shopId: shop.id,
        userId: t.id
      })), { transaction });
    }
    await shop.save({ transaction });
    await transaction.commit();

    return shop;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }

}

export async function removeShop(wId) {
  const shop = await db.Shop.findByPk(wId);
  if (!shop) {
    throw badRequest("shop", FIELD_ERROR.INVALID, "Shop not found");
  }
  return db.Shop.destroy({
    where: { id: shop.id }
  });
}
