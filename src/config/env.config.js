import 'dotenv/config';

const port = Number(process.env.PORT ?? 8080);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT debe ser un número entero entre 1 y 65535');
}

const jwtSecret = process.env.JWT_SECRET;

if (
  !jwtSecret?.trim() ||
  jwtSecret.trim() === 'reemplazar_por_un_secreto_propio' ||
  Buffer.byteLength(jwtSecret.trim(), 'utf8') < 32
) {
  throw new Error(
    'JWT_SECRET debe ser un secreto propio de al menos 32 bytes. Revisá el archivo .env.'
  );
}

export const env = {
  port,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongoUrl: process.env.MONGO_URL,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
};