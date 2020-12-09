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
// describe('goods-issue.controller.js', () => {
//   let user;
//   let token;
//   let inventoryId;
//   before(async () => {
//     await beforeTest();
//     await beforeTestProduct();
//     const transaction = await db.sequelize.transaction();
//     try {
//       await db.WareHouse.truncate({transaction});
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
//       warehouseId: 1,
//       name: "string (max 250)",
//       remark: "string",
//       purposeId: 1,
//       relativeId: 1,
//       companyId: 1,
//       details: [
//         {
//           productId: 1,
//           unitId: 1,
//           quantity: 2.4,
//           remark: "restes"
//         }
//       ]
//     };
//     const res = await chai.request(app)
//       .post('/api/inventory/goods-issue')
//       .set('Authorization', `Bearer ${token}`)
//       .send(createForm);
//     res.should.have.status(200);
//     res.body.should.be.a('object');
//     res.body.should.have.property('warehouseId').eql(createForm.warehouseId);
//     res.body.should.have.property('name').eql(createForm.name);
//     res.body.should.have.property('remark').eql(createForm.remark);
//     inventoryId = res.body.id;
//   });
//
//   it('Update', async () => {
//     const updateForm = {
//       warehouseId: 1,
//       name: "string (max 250)",
//       remark: "string",
//       purposeId: 1,
//       relativeId: 1,
//       companyId: 1,
//       details: [
//         {
//           productId: 1,
//           unitId: 1,
//           quantity: 2.4,
//           remark: "restes"
//         }
//       ]
//     };
//     const res = await chai.request(app)
//       .post(`/api/inventory/goods-issue/${inventoryId}`)
//       .set('Authorization', `Bearer ${token}`)
//       .send(updateForm);
//     res.should.have.status(200);
//     res.body.should.be.a('object');
//     res.body.should.be.a('object');
//     res.body.should.have.property('warehouseId').eql(updateForm.warehouseId);
//     res.body.should.have.property('name').eql(updateForm.name);
//     res.body.should.have.property('remark').eql(updateForm.remark);
//   });
//
//   it('getById', async () => {
//     const res = await chai.request(app)
//       .get(`/api/inventory/goods-issue/${inventoryId}`)
//       .set('Authorization', `Bearer ${token}`);
//     res.should.have.status(200);
//     console.log(res.body);
//   });
//
//   it('delete', async () => {
//     const res = await chai.request(app)
//       .delete(`/api/inventory/goods-issue/${inventoryId}`)
//       .set('Authorization', `Bearer ${token}`);
//     res.should.have.status(200);
//     console.log(res.body);
//   });
// });
