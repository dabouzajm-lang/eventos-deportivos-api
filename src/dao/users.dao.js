import User from '../models/User.js';

export const findUserByEmail = async (email) => {
  return User.findOne({ email }).exec();
};

export const createUser = async (userData) => {
  return User.create(userData);
};