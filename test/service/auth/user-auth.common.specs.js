import db from '../../../app/db/models';
import { buildUserCompany, buildUserCompanyInformation } from '../../../app/service/auth/user-auth.common';

describe('user-auth.common.specs.js', () => {
  it('buildUserCompanyInformation', async function renderTemplate() {
    const userCompany = await db.UserCompany.findOne({
      where: {
        userId: 1,
        companyId: 2
      },
      include: [
        { model: db.User, as: 'user' },
        { model: db.Company, as: 'company' }
      ]
    });
    console.log(await buildUserCompanyInformation(userCompany.user, userCompany.company, userCompany.groupId));
  });

  it('buildUserCompany', async function renderTemplate() {
    console.log(await buildUserCompany({
      userId: 1, companyId: 2
    }));
  });
});
