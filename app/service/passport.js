import passportJWT from 'passport-jwt';
import APP_CONFIG from '../config/application';


const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

export default passport => {
  passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: APP_CONFIG.JWT.secret,
      ignoreExpiration: true,
      maxAge: '1m'
    },
    (jwtPayload, cb) => cb(null, jwtPayload)
  ));
}
