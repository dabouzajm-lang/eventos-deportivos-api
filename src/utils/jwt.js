import jwt from 'jsonwebtoken';
import { env } from '../config/env.config.js';

const algorithm = 'HS256';

export const signToken = ({ id, email, role }) => {
  return jwt.sign({ id, email, role }, env.jwtSecret, {
    algorithm,
    expiresIn: env.jwtExpiresIn,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret, {
    algorithms: [algorithm],
  });
};