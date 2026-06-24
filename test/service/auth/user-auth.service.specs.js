import { userLogin } from '../../../app/service/auth/user-auth.service';

describe('user-auth.service.specs.js', () => {
  it('userLogin', async () => {
    const loginResp = await userLogin({ email: 'lephuoccanh@gmail.com', password: 'Ittech1@#$' });
    console.log(loginResp);
  });
});
