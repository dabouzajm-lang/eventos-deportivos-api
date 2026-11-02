import { registerUser } from '../services/sessions.service.js';
import AppError from '../utils/AppError.js';

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