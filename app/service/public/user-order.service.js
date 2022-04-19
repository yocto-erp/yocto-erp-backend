import db from '../../db/models';
import { formatNumberDB, fromBigNumberJson } from '../../util/math.util';
import { ORDER_PAYMENT_STATUS, ORDER_SOURCE, ORDER_STATUS, ORDER_TYPE } from '../../db/models/order/order';
import { badRequest, FIELD_ERROR } from '../../config/error';
import { SUBJECT_CATEGORY } from '../../db/models/partner/subject';

export async function userOrderProductInShop(form, userAgent, ip) {
  const totalWithTax = fromBigNumberJson(form.totalWithTax);
  const tax = fromBigNumberJson(form.tax);
  const transaction = await db.sequelize.transaction();
  let subjectNew = null;
  try {
    // check user login or not login
    if (form && form.userId) {
      const checkUser = await db.User.findOne({where:{ id: form.userId }});
      if (!checkUser) {
        throw badRequest('user', FIELD_ERROR.INVALID, 'user not found');
      }
      const checkPerson = await db.Person.findOne({where:{ id: checkUser.personId }});
      if (!checkPerson) {
        throw badRequest('person', FIELD_ERROR.INVALID, 'person not found');
      }
      const checkSubject = await db.Subject.findOne({
        where: {
          userId: form.userId,
          companyId: form.companyId
        }
      });
      if (!checkSubject) {
        subjectNew =await db.Subject.create({
          name: checkUser.displayName,
          gsm: checkPerson.gsm,
          email: checkUser.email,
          companyId: form.companyId,
          type: SUBJECT_CATEGORY.CUSTOMER,
          subjectCompanyId: 0,
          personId: checkPerson?.id || 0,
          contactPersonId: 0,
          createdDate: new Date(),
          lastActionedDate: new Date(),
          createdById: checkUser?.id || 0,
          imageId: null
        }, { transaction });
      } else {
        subjectNew = checkSubject;
      }
    } else {
      // user by product but not login
      const person = await db.Person.create(
        {
          firstName: form.firstName,
          lastName: form.lastName,
          fullName: `${form.firstName} ${form.lastName}`,
          gsm: form?.phone,
          email: form.email,
          address: form?.address || '',
          createdById: form.userId ? form.userId : 0,
          createdDate: new Date()
        }, { transaction }
      );
      await db.PartnerPerson.create({
        companyId: form.companyId,
        personId: person.id
      }, { transaction });

      subjectNew = await db.Subject.create({
        name: person.fullName,
        gsm: person.gsm,
        email: person.email,
        companyId: form.companyId,
        type: SUBJECT_CATEGORY.CUSTOMER,
        subjectCompanyId: 0,
        personId: person?.id || 0,
        contactPersonId: 0,
        createdDate: new Date(),
        lastActionedDate: new Date(),
        createdById: form.userId ? form.userId : 0
      }, { transaction });

    }

      const order = await db.Order.create({
        name: `user-order-ecommerce${new Date}`,
        remark: `user-order-ecommerce${new Date}`,
        subjectId: subjectNew?.id,
        createdById: form.userId ? form.userId : 0,
        companyId: form.companyId,
        processedDate: new Date(),
        type: ORDER_TYPE.SALE,
        totalAmount: formatNumberDB(totalWithTax),
        taxAmount: formatNumberDB(tax),
        createdDate: new Date(),
        shopId: 0,
        paymentStatus: ORDER_PAYMENT_STATUS.PENDING,
        status: form.isShipping ? ORDER_STATUS.SHIPPING : ORDER_STATUS.DONE,
        source: ORDER_SOURCE.ECOMMERCE,
        ip
      }, { transaction });

      const orderDetails = [];
      const orderDetailTaxes = [];
      const ecommerceDetails = [];
    for (let i = 0; i < form.products.length; i += 1) {
      const { product, qty, taxes: productTaxes, price, id } = form.products[i];
      orderDetails.push({
        orderDetailId: i + 1,
        orderId: order.id,
        productId: product.id,
        productUnitId: product.unitId,
        quantity: qty,
        price
      });
      ecommerceDetails.push({
        ecommerceOrderId: order.id,
        detailId: i + 1,
        ecommerceProductId: id
      });
      for (let j = 0; j < productTaxes.length; j += 1) {
        const taxItem = productTaxes[j];
        const taxAmount = fromBigNumberJson(taxItem.taxAmount);
        orderDetailTaxes.push({
          orderDetailId: i + 1,
          orderId: order.id,
          taxId: taxItem.id,
          amount: formatNumberDB(taxAmount)
        });
      }
    }

    await db.OrderDetail.bulkCreate(orderDetails, { transaction });
    await db.OrderDetailTax.bulkCreate(orderDetailTaxes, { transaction });
    const ecommerceOrder = await db.EcommerceOrder.create({
      orderId: order.id,
      customerOrderId: form.userId ? form.userId:`${form.firstName} ${form.lastName}`,
      remark: `user-order-ecommerce${new Date}`,
      userAgent,
      isConfirmed: false
    }, { transaction });
    await db.EcommerceOrderDetail.bulkCreate(ecommerceDetails, { transaction });
    await transaction.commit();
    return ecommerceOrder;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}
