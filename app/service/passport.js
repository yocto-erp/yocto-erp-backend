import passportJWT from 'passport-jwt';
import { buildUserCompany } from './auth/user-auth.common';
import { appLog } from '../config/winston';
import { JWT_SECRET } from './auth/jwt.service';


const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

export default passport => {
  passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
      ignoreExpiration: true,
      maxAge: '1d'
    },
    async (jwtPayload, cb) => {
      appLog.info(`User logged in: ${JSON.stringify(jwtPayload)}`);
      const { id: userId, companyId, jti } = jwtPayload;
      if (userId && companyId) {
        try {
          const resp = await buildUserCompany({
            userId, companyId
          });
          return cb(null, resp);
        } catch (err) {
          return cb(err, jwtPayload);
        }
      } else {
        // In case user not yet choose company, should migrate to default choose first company
        return cb(null, jwtPayload);
      }

    }
  ));
}
