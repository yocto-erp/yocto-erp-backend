import { generatePDF } from '../../../app/service/student/student-monthly-fee.service';
import { getStudentMonthlyFee, toPrintData } from '../../../app/service/student/student-monthly-fee-new.service';

describe('Student Month Fee Test', () => {
  it('generate PDF', async function vote() {
    console.log(await generatePDF(5, '442ea2a9000000000000000000000000', 1));
  });
  it('getStudentMonthlyFee by Id', async () => {
    const rs = await getStudentMonthlyFee('107', {
      id: 1, companyId: 2
    });
    console.log(rs);
  });
  it('toPrintData', async () => {
    const rs = await toPrintData(108, 2);
    console.log(rs);
  });
  it('generatePDF studentFee', async () => {
    const rs = await generatePDF(1, '157db5a5000000000000000000000000', 2);
    console.log(rs);
  });
});
