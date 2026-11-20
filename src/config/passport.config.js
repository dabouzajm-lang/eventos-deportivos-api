import passport from 'passport';
import passportCustom from 'passport-custom';
import passportJwt from 'passport-jwt';
import { env } from './env.config.js';
import {
  registerUser,
  loginUser,
} from '../services/sessions.service.js';
import AppError from '../utils/AppError.js';

const CustomStrategy = passportCustom.Strategy;
const JwtStrategy = passportJwt.Strategy;

const cookieExtractor = (req) => {
  const token = req?.cookies?.currentUser;

  return typeof token === 'string' ? token : null;
};

const configureRegisterStrategy = () => {
  passport.use(
    'register',
    new CustomStrategy(async (req, done) => {
      try {
        const user = await registerUser(req.body);

        return done(null, user);
      } catch (error) {
        if (error instanceof AppError) {
          return done(null, false, {
            statusCode: error.statusCode,
            message: error.message,
          });
        }

        return done(error);
      }
    })
  );
};

const configureLoginStrategy = () => {
  passport.use(
    'login',
    new CustomStrategy(async (req, done) => {
      try {
        const user = await loginUser(req.body);

        return done(null, user);
      } catch (error) {
        if (error instanceof AppError) {
          return done(null, false, {
            statusCode: error.statusCode,
            message: error.message,
          });
        }

        return done(error);
      }
    })
  );
};

const configureCurrentStrategy = () => {
  passport.use(
    'current',
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: env.jwtSecret,
        algorithms: ['HS256'],
        ignoreExpiration: false,
      },
      (payload, done) => {
        if (
          typeof payload.id !== 'string' ||
          typeof payload.email !== 'string' ||
          !['user', 'organizer', 'admin'].includes(payload.role)
        ) {
          return done(null, false);
        }

        return done(null, {
          id: payload.id,
          email: payload.email,
          role: payload.role,
        });
      }
    )
  );
};

export const configurePassport = () => {
  configureRegisterStrategy();
  configureLoginStrategy();
  configureCurrentStrategy();
};

export default passport;