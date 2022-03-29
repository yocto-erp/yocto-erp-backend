import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';
import {hasText} from '../../util/string.util';

const {Op} = db.Sequelize;

export async function listECommerceProducts(user, {search}, paging) {
  const where = {companyId: user.companyId};
  if (hasText(search)) {
    where.webDisplayName = {
      [Op.like]: `%${search}%`
    };
  }
  return db.EcommerceProduct.findAndCountAll({
    where,
    include: [
      {model: db.Product, as: 'product'},
      {model: db.TaxSet, as: 'taxSet'},
      {model: db.User, as: 'lastModifiedBy'},
      {model: db.ProductUnit, as: 'unit', where: {productId: {[Op.col]: 'ecommerceProduct.productId'}}}
    ],
    ...paging
  });
}

export async function createEcommerceProduct(user, formData) {
  const {
    product,
    unit,
    webDisplayName,
    shortName,
    price,
    remark,
    taxSet,
    otherParams
  } = formData;
  return db.EcommerceProduct.create({
    productId: product.id,
    unitId: unit.id,
    companyId: user.companyId,
    webDisplayName,
    shortName,
    price,
    remark,
    taxSetId: taxSet?.id,
    otherParams,
    lastModifiedById: user.id,
    lastModifiedDate: new Date()
  });
}

export async function getEcommerceProduct(user, id) {
  const item = await db.EcommerceProduct.findOne({
    where: {
      id, companyId: user.companyId
    },
    include: [
      {model: db.Product, as: 'product'},
      {model: db.Tax, as: 'taxes'},
      {model: db.TaxSet, as: 'taxSet'},
      {model: db.ProductUnit, as: 'unit'}
    ]
  });
  if (!item) {
    throw badRequest('product', FIELD_ERROR.INVALID, 'Invalid product');
  }
  return item;
}

export async function updateEcommerceProduct(user, id, formData) {
  const existed = await getEcommerceProduct(user, id);

  const {
    product,
    unit,
    webDisplayName,
    shortName,
    price,
    taxSet,
    remark,
    otherParams
  } = formData;
  existed.productId = product.id;
  existed.unitId = unit.id;
  existed.webDisplayName = webDisplayName;
  existed.shortName = shortName;
  existed.taxSetId = taxSet?.id;
  existed.price = price;
  existed.remark = remark;
  existed.otherParams = otherParams;
  existed.lastModifiedById = user.id;
  existed.lastModifiedDate = new Date();
  return existed.save();
}

export async function removeEcommerceProduct(user, id) {
  const existed = await getEcommerceProduct(user, id);
  return existed.destroy();
}
