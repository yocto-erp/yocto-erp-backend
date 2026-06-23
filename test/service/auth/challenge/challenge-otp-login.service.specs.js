import { confirmOTPLogin, createOTPLogin } from '../../../../app/service/auth/challenge/challenge-otp-login.service';
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
  it('confirmOTPLogin', async () => {
    const rs = await confirmOTPLogin({
      challengePublicId: '4a93a464-d998-4cab-a761-48b433375bd5', userAgent: 'testing user agent',
      email: 'lephuoccanh@gmail.com',
      ip: '127.0.0.1', code: '0X2Vkb'
    });
    console.log(rs);
  });
});
