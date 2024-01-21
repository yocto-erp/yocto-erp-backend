import { verify } from 'hcaptcha';
import { badRequest, FIELD_ERROR } from '../../config/error';

const hCaptchaSecret = process.env.hcaptcha;

export const verifyCaptcha = async (token) => {
  const resp = await verify(hCaptchaSecret, token);
  if (resp.success) {
    return resp;
  }
  throw badRequest('Captcha', FIELD_ERROR.INVALID, 'Invalid captcha');

};
