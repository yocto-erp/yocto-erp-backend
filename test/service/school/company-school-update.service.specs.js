import { downloadCompanySchoolUpdate } from '../../../app/service/company-school/company-school-update.service';


describe('school-update.service.specs.js', () => {
  it('downloadCompanySchoolUpdate', async () => {
    console.log(await downloadCompanySchoolUpdate({}, { ids: '15' }));
  });
});
