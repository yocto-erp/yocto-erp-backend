import db from '../../app/db/models';
import { registerTest } from './auth.service.specs';
import { createCompany } from '../../app/service/company/company.service';

export async function beforeTest() {
  const formUser = {
    email: 'tanduy899@gmail.com',
    password: '1234',
    displayName: 'duynt'
  };

  const formCompany= {
    name: 'BAP',
    gsm: 'ABD1234',
    address: '81 quang trung',
    remark: 'software'
  };
  const transaction = await db.sequelize.transaction();
  try {
    await db.User.truncate({transaction});
    await db.ACLGroup.truncate({transaction});
    await db.ACLGroupAction.truncate({transaction});
    await db.ACLGroupActionShop.truncate({transaction});
    await db.UserCompany.truncate({transaction});
    // await db.CompanyShop.truncate({transaction});
    // await db.Company.truncate({transaction});

    const user = await registerTest(formUser, transaction);
    const company = await createCompany(user.id, formCompany);
    await db.UserCompany.create({
      userId: user.id,
      companyId: company.id
    }, transaction);

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}
