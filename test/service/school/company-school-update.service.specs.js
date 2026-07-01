import {
  downloadCompanySchoolUpdate,
  schoolToPrintData
} from '../../../app/service/company-school/company-school-update.service';


describe('school-update.service.specs.js', () => {
  it('downloadCompanySchoolUpdate', async () => {
    console.log(await downloadCompanySchoolUpdate({}, { ids: '15' }));
  });
  it('schoolToPrintData', async () => {
    const rs = await schoolToPrintData(1);
    console.log(JSON.stringify(rs, null, 2));
  });
});
