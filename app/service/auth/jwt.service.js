import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { uuidV4 } from '../../util/string.util';
import { SYSTEM_CONFIG } from '../../config/system';


const privateKeyPath = path.join(
  __dirname,
  "..",
  "..",
  "config",
  "rsa-private-key.pem"
);
export const JWT_SECRET = fs.readFileSync(privateKeyPath, "utf-8");
const ALGO = "RS256";
export const getJWTExpiredToken = async () => {
  return Number(
    SYSTEM_CONFIG.AUTH_EXPIRED_TOKEN || 30
  );
};

const getJWTOption = async () => {
  const expiredTokenMinute = await getJWTExpiredToken();
  return {
    expiresIn: expiredTokenMinute * 60,
    algorithm: ALGO,
    jwtid: uuidV4()
  };
};

export const generateUserToken = async ({userId, companyId}) => {
  return jwt.sign(
    {
      id: userId,
      companyId
    },
    JWT_SECRET,
    await getJWTOption()
  );
};
