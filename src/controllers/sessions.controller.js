import { loginUser, registerUser } from '../services/sessions.service.js';
import { env } from '../config/env.config.js';
import AppError from '../utils/AppError.js';

const authCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.nodeEnv === 'production',
  path: '/',
};

export const getSessionsStatus = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Recurso sessions preparado. Registro disponible.',
  });
};

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json({
      status: 'success',
      payload: user,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    console.error('Error inesperado al registrar usuario:', error.name);

    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
    });
  }
};

export const login = async (req, res) => {
  try {
    const token = await loginUser(req.body);

    res.cookie('currentUser', token, {
      ...authCookieOptions,
      maxAge: 3600000,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Login correcto',
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    console.error('Error inesperado al iniciar sesión:', error.name, error.message);
    console.error('Ubicación:', error.stack?.split('\n')[1]?.trim());
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
    payload: { id, email, role },
  });
};

export const logout = (req, res) => {
  res.clearCookie('currentUser', authCookieOptions);

  return res.status(200).json({
    status: 'success',
    message: 'Sesión cerrada',
  });
};