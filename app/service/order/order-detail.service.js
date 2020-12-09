import db from '../../db/models';

export function createOrderDetail(orderId, orderDetailsForm, transaction) {
  return db.OrderDetail.bulkCreate(orderDetailsForm.map((result, index) => {
    return {
      orderDetailId: index + 1,
      orderId: orderId,
      productId: result.productId,
      productUnitId: result.unitId,
      quantity: result.quantity,
      remark: result.remark,
      price: result.price
    }
  }), {transaction})
}

export function removeOrderDetail(orderId, transaction) {
  return db.OrderDetail.destroy(
    {
      where: {
        orderId: orderId
      }
    }, {transaction}
  );
}
