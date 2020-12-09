import db from '../../db/models';
import User from '../../db/models/user/user';
import {badRequest, FIELD_ERROR} from '../../config/error';
import {
  createProductAsset, mergeAssets, removeProductAssets,
  updateProductAssets
} from '../asset/asset.service';
import {createProductUnit, removeProductUnit} from './product-unit.service';

const {Op} = db.Sequelize;

export function products(user, query, order, offset, limit) {
  const {search} = query;
  const where = {companyId: user.companyId};
  if (search && search.length) {
    where.name = {
      [Op.like]: `%${search}%`
    }
  }
  return db.Product.findAndCountAll({
    order,
    where,
    include: [
      {
        model: User, as: 'createdBy',
        attributes: ['id', 'displayName', 'email']
      }, {
        model: User, as: 'lastModifiedBy',
        attributes: ['id', 'displayName', 'email']
      }
    ],
    offset,
    limit
  });
}

export async function getProduct(user, pId) {
  const product = await db.Product.findOne({
    where: {
      id: pId,
      companyId: user.companyId
    },
    include: [
      {
        model: db.Asset,
        as: 'assets',
        attributes: ['id', 'name', 'type', 'ext', 'size', 'fileId', 'source'],
        through: {attributes: []}
      },
      {model: db.ProductUnit, as: 'units', attributes: ['id', 'name', 'rate']}
    ]
  });
  if (!product) {
    throw badRequest('product', FIELD_ERROR.INVALID, 'product not found');
  }
  return product;
}

export async function createProduct(user, createForm) {

  const transaction = await db.sequelize.transaction();

  try {
    const product = await db.Product.create({
      name: createForm.name.trim(),
      remark: createForm.remark.trim(),
      priceBaseUnit: createForm.priceBaseUnit,
      companyId: user.companyId,
      createdById: user.id,
      createdDate: new Date()
    }, {transaction});

    if (createForm.assets && createForm.assets.length) {
      await createProductAsset(product.id, user.companyId, createForm.assets, transaction);
    }

    if (createForm.units && createForm.units.length) {
      await createProductUnit(product.id, createForm.units, transaction);
    }
    await transaction.commit();
    return product;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function updateProduct(pId, user, updateForm) {

  const existedProduct = await db.Product.findByPk(pId, {
    include: [{model: db.Asset, as: 'assets'}]
  });
  if (!existedProduct) {
    throw badRequest('product', FIELD_ERROR.INVALID, 'product not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    await existedProduct.update({
      name: updateForm.name.trim(),
      remark: updateForm.remark.trim(),
      priceBaseUnit: updateForm.priceBaseUnit,
      lastModifiedDate: new Date(),
      lastModifiedById: user.id
    }, transaction);

    const listMerge = await mergeAssets(existedProduct.assets, updateForm.assets, user.companyId);
    if ((listMerge && listMerge.length) || (existedProduct.assets && existedProduct.assets.length)) {
      await updateProductAssets(existedProduct.assets, listMerge, pId, transaction)
    }

    if (updateForm.units && updateForm.units.length) {
      await removeProductUnit(existedProduct.id, transaction);
      await createProductUnit(existedProduct.id, updateForm.units, transaction);
    }

    await transaction.commit();
    return existedProduct;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

}

export async function removeProduct(productId) {
  const checkProduct = await db.Product.findByPk(productId, {
    include: [{model: db.Asset, as: 'assets'}]
  });
  if (!checkProduct) {
    throw badRequest('product', FIELD_ERROR.INVALID, 'product not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    if (checkProduct.assets && checkProduct.assets.length) {
      await removeProductAssets(checkProduct, transaction);
    }
    await removeProductUnit(checkProduct.id, transaction);
    const product = db.Product.destroy({
      where: {id: checkProduct.id}
    }, {transaction});
    await transaction.commit();
    return product;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
