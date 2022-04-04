import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';

export async function updateUnit(user, pId, updateForm) {
  const existedProduct = await db.Product.findOne({id: pId, companyId: user.companyId});
  if (!existedProduct) {
    throw badRequest('product', FIELD_ERROR.INVALID, 'Product not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    let units;
    if (updateForm && updateForm.length) {
      await db.ProductUnit.destroy(
        {
          where: {
            productId: existedProduct.id
          }
        }, {transaction}
      )
      units = await db.ProductUnit.bulkCreate(updateForm.map((result, index) => {
        return {
          id: index + 1,
          productId: existedProduct.id,
          name: result.name.trim(),
          rate: result.rate
        }
      }), {transaction})
    }
    await transaction.commit();
    return units;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
