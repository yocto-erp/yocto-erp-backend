import db from '../../../app/db/models';

import {app} from "../../../app/server";

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('auth.controller.js', () => {
  beforeEach(async () => {
    const transaction = await db.sequelize.transaction();
    try {
      await db.User.truncate({transaction});
      await db.ACLGroup.truncate({transaction});
      await db.ACLGroupAction.truncate({transaction});
      await db.ACLGroupActionShop.truncate({transaction});
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  });

  it('Register', (done) => {
    const form = {
      email: 'admin@gmail.com',
      password: 'admin'
    };
    chai.request(app)
      .post('/api/register')
      .send(form)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('id').eql(1);
        res.body.should.have.property('email').eql(form.email);
        res.body.should.have.property('status').eql(1);
        res.body.should.have.property('pwd');
        db.User.comparePassword(form.password, res.body.pwd).should.true;
        done();
      });
  });
});
