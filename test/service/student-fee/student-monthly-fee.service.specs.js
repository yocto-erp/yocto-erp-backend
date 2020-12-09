import {generatePDF} from "../../../app/service/student/student-monthly-fee.service";

describe('Student Month Fee Test', () => {
  it('generate PDF', async function vote() {
    console.log(await generatePDF(5, '442ea2a9000000000000000000000000', 1));
  });
});
