// import { beforeTest } from '../../service/warehouse.service.specs';
// import {signInTest} from '../../service/auth.service.specs';
// import {app} from '../../../app/server';
//
// const chai = require('chai');
// const chaiHttp = require('chai-http');
//
// chai.should();
// chai.use(chaiHttp);
//
//
// describe('inventory.controller.js', () => {
//   let user;
//   let token;
//   before(async () => {
//     await beforeTest();
//     const formLogin = {
//       email: 'tanduy899@gmail.com',
//       password: '1234'
//     };
//     const signResponse = await signInTest(formLogin);
//     ({token, user} = signResponse);
//   });
//
//   it('getAllInventory', async () => {
//     const res = await chai.request(app)
//       .get(`/api/inventory`)
//       .set('Authorization', `Bearer ${token}`);
//     res.should.have.status(200);
//     console.log(res.body);
//   });
// });
