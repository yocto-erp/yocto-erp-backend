import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';

export function createProductUnit(productId, unitsForm, transaction) {
  return db.ProductUnit.bulkCreate(unitsForm.map((result, index) => {
    return {
      id: index + 1,
      productId: productId,
      name: result.name.trim(),
      rate: result.rate
    }
  }), {transaction})
}

export function removeProductUnit(productId, transaction) {
  return db.ProductUnit.destroy(
    {
      where: {
        productId: productId
      }
    }, {transaction}
  );
}

export async function updateUnit(pId, updateForm) {
  const existedProduct = await db.Product.findByPk(pId);
  if (!existedProduct) {
    throw badRequest('product', FIELD_ERROR.INVALID, 'product not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    let units;
    if (updateForm && updateForm.length) {
      await removeProductUnit(existedProduct.id, transaction);
      units = await createProductUnit(existedProduct.id, updateForm, transaction);
    }
    await transaction.commit();
    return units;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
