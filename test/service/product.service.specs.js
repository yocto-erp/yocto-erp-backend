import db from '../../app/db/models';

export async function beforeTestProduct() {

  const transaction = await db.sequelize.transaction();
  try {
    await db.ProductAsset.truncate({transaction});
    await db.ProductUnit.truncate({transaction});
    await db.Product.truncate({transaction});
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}
