import {
  getUserByEmail,
  saveUser,
} from '../repositories/users.repository.js';
import { hashPassword } from '../utils/hash.js';
import AppError from '../utils/AppError.js';

export const registerUser = async (data = {}) => {
  const { first_name, last_name, email, password } = data ?? {};

  const requiredFields = [first_name, last_name, email, password];

  if (
    requiredFields.some(
      (value) => value === undefined || value === null || value === ''
    )
  ) {
    throw new AppError('Faltan campos obligatorios', 400);
  }

  if (requiredFields.some((value) => typeof value !== 'string')) {
    throw new AppError('Los campos deben ser de tipo texto', 400);
  }

  const normalizedFirstName = first_name.trim();
  const normalizedLastName = last_name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedFirstName || !normalizedLastName || !normalizedEmail) {
    throw new AppError('Faltan campos obligatorios', 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    throw new AppError('El formato del email es inválido', 400);
  }

  if (password.trim().length < 8) {
    throw new AppError(
      'La contraseña debe tener al menos 8 caracteres sin contar espacios al inicio y al final',
      400
    );
  }

  if (Buffer.byteLength(password, 'utf8') > 72) {
    throw new AppError(
      'La contraseña no puede superar los 72 bytes',
      400
    );
  }

  const existingUser = await getUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new AppError('El email ya está registrado', 409);
  }

  const hashedPassword = await hashPassword(password);

  let user;

  try {
    user = await saveUser({
      first_name: normalizedFirstName,
      last_name: normalizedLastName,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user',
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('El email ya está registrado', 409);
    }

    throw error;
  }

  return {
    id: user._id.toString(),
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
  };
};