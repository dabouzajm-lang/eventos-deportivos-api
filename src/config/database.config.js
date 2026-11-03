import mongoose from 'mongoose';
import { env } from './env.config.js';

export const connectDatabase = async () => {
  if (!env.mongoUrl) {
    throw new Error('La variable MONGO_URL es obligatoria');
  }

  await mongoose.connect(env.mongoUrl, {
    dbName: 'eventos_deportivos',
    serverSelectionTimeoutMS: 10000,
  });

  console.log(
    `MongoDB conectado a la base: ${mongoose.connection.name}`
  );
};