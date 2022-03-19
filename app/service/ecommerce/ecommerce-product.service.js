import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';
import { hasText } from '../../util/string.util';

const { Op } = db.Sequelize;

export async function listECommerceProducts(user, { search }, paging) {
  const where = { companyId: user.companyId };
  if (hasText(search)) {
    where.webDisplayName = {
      [Op.like]: `%${search}%`
    };
  }
  return db.EcommerceProduct.findAndCountAll({
    where,
    include: [
      { model: db.Product, as: 'product' },
      { model: db.WareHouse, as: 'warehouse' },
      { model: db.User, as: 'lastUpdatedBy' },
      { model: db.ProductUnit, as: 'unit', where: { productId: { [Op.col]: 'ecommerceProduct.productId' } } }
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
    description,
    otherParams,
    isWarehouse,
    warehouse
  } = formData;
  return db.EcommerceProduct.create({
    productId: product.id,
    unitId: unit.id,
    companyId: user.companyId,
    webDisplayName,
    shortName,
    price,
    description,
    otherParams,
    isWarehouse,
    fromWarehouseId: warehouse?.id,
    lastUpdatedById: user.id,
    lastUpdatedDate: new Date()
  });
}

export async function getEcommerceProduct(user, id) {
  return db.EcommerceProduct.findOne({
    where: {
      id, companyId: user.companyId
    },
    include: [
      { model: db.Product, as: 'product' },
      { model: db.ProductUnit, as: 'unit' }
    ]
  });
}

export async function updateEcommerceProduct(user, id, formData) {
  const existed = await getEcommerceProduct(user, id);
  if (!existed) {
    throw badRequest('product', FIELD_ERROR.INVALID, 'Invalid product');
  }
  const {
    product,
    unit,
    webDisplayName,
    shortName,
    price,
    description,
    otherParams,
    isWarehouse,
    warehouse
  } = formData;
  existed.productId = product.id;
  existed.unitId = unit.id;
  existed.webDisplayName = webDisplayName;
  existed.shortName = shortName;
  existed.price = price;
  existed.description = description;
  existed.otherParams = otherParams;
  existed.isWarehouse = isWarehouse;
  existed.fromWarehouseId = warehouse?.id;
  existed.lastUpdatedById = user.id;
  existed.lastUpdatedDate = new Date();
  return existed.save();
}
