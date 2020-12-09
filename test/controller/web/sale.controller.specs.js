// import { beforeTest } from '../../service/warehouse.service.specs';
// import {signInTest} from '../../service/auth.service.specs';
// import {app} from '../../../app/server';
// import { beforeTestProduct } from '../../service/product.service.specs';
// import db from '../../../app/db/models';
//
// const chai = require('chai');
// const chaiHttp = require('chai-http');
//
// chai.should();
// chai.use(chaiHttp);
//
//
// describe('sale.controller.js', () => {
//   let user;
//   let token;
//   let orderId;
//   before(async () => {
//     await beforeTest();
//     await beforeTestProduct();
//     const transaction = await db.sequelize.transaction();
//     try {
//       await db.OrderDetail.truncate({transaction});
//       await transaction.commit();
//     } catch (e) {
//       await transaction.rollback();
//       throw e;
//     }
//     const formLogin = {
//       email: 'tanduy899@gmail.com',
//       password: '1234'
//     };
//     const signResponse = await signInTest(formLogin);
//     ({token, user} = signResponse);
//   });
//
//   it('Create', async () => {
//     const createForm = {
//       name: "string (max 150)",
//       remark: "string",
//       partnerCompanyId: 1,
//       partnerPersonId: 1,
//       details: [
//         {
//           productId: 1,
//           unitId: 1,
//           quantity: 23,
//           price: 32,
//           productUnitId: 1,
//           remark: "ffsdfsf"
//         }
//       ]
//     };
//     const res = await chai.request(app)
//       .post('/api/order/sale')
//       .set('Authorization', `Bearer ${token}`)
//       .send(createForm);
//     res.should.have.status(200);
//     res.body.should.be.a('object');
//     res.body.should.have.property('name').eql(createForm.name);
//     res.body.should.have.property('remark').eql(createForm.remark);
//     res.body.should.have.property('partnerCompanyId').eql(createForm.partnerCompanyId);
//     res.body.should.have.property('partnerPersonId').eql(createForm.partnerPersonId);
//     orderId = res.body.id;
//   });
//
//   it('Update', async () => {
//     const updateForm = {
//       name: "string (max 150)",
//       remark: "string",
//       partnerCompanyId: 1,
//       partnerPersonId: 1,
//       details: [
//         {
//           productId: 1,
//           unitId: 1,
//           quantity: 23,
//           price: 32,
//           productUnitId: 1,
//           remark: "ffsdfsf"
//         }
//       ]
//     };
//     const res = await chai.request(app)
//       .post(`/api/order/sale/${orderId}`)
//       .set('Authorization', `Bearer ${token}`)
//       .send(updateForm);
//     res.should.have.status(200);
//     res.body.should.be.a('object');
//     res.body.should.have.property('name').eql(updateForm.name);
//     res.body.should.have.property('remark').eql(updateForm.remark);
//     res.body.should.have.property('partnerCompanyId').eql(updateForm.partnerCompanyId);
//     res.body.should.have.property('partnerPersonId').eql(updateForm.partnerPersonId);
//   });
//
//   it('getAllSale', async () => {
//     const res = await chai.request(app)
//       .get(`/api/order/sale`)
//       .set('Authorization', `Bearer ${token}`);
//     res.should.have.status(200);
//     console.log(res.body);
//   });
//
//   it('getById', async () => {
//     const res = await chai.request(app)
//       .get(`/api/order/sale/${orderId}`)
//       .set('Authorization', `Bearer ${token}`);
//     res.should.have.status(200);
//     console.log(res.body);
//   });
//
//   it('delete', async () => {
//     const res = await chai.request(app)
//       .delete(`/api/order/sale/${orderId}`)
//       .set('Authorization', `Bearer ${token}`);
//     res.should.have.status(200);
//     console.log(res.body);
//   });
// });
