import { env } from '../config/env.config.js';
import { signToken, verifyToken } from '../utils/jwt.js';

const authCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.nodeEnv === 'production',
  path: '/',
};

export const getSessionsStatus = (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Recurso sessions preparado. Registro disponible.',
  });
};

export const register = (req, res) => {
  const { id, first_name, last_name, email, role } = req.user;

  return res.status(201).json({
    status: 'success',
    payload: {
      id,
      first_name,
      last_name,
      email,
      role,
    },
  });
};

export const login = (req, res) => {
  try {
    const { id, email, role } = req.user;
    const token = signToken({ id, email, role });
    const { exp } = verifyToken(token);

    const maxAge = Math.max(0, exp * 1000 - Date.now());

    res.cookie('currentUser', token, {
      ...authCookieOptions,
      maxAge,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Login correcto',
    });
  } catch (error) {
    console.error(
      'Error inesperado al iniciar sesión:',
      error.name,
      error.message
    );

    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
    });
  }
};

export const current = (req, res) => {
  const { id, email, role } = req.user;

  return res.status(200).json({
    status: 'success',
    payload: {
      id,
      email,
      role,
    },
  });
};

export const logout = (req, res) => {
  res.clearCookie('currentUser', authCookieOptions);

  return res.status(200).json({
    status: 'success',
    message: 'Sesión cerrada',
  });
};