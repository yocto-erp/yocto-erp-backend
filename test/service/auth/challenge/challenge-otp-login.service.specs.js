import { createOTPLogin } from '../../../../app/service/auth/challenge/challenge-otp-login.service';
import { sendOTPEmail } from '../../../../app/service/auth/challenge/challenge-otp.service';


describe('challenge-otp-login', () => {
  it('createOTPLogin', async function renderTemplate() {
    console.log(await createOTPLogin({
      email: 'lephuoccanh@gmail.com',
      userAgent: 'testing user agent',
      ip: '127.0.0.1'
    }));
  });

  it('send-challenge-email', async function renderTemplate() {
    console.log(await sendOTPEmail(1, {
      email: 'lephuoccanh@gmail.com'
    }));
  });
});
