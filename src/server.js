import { env } from './config/env.config.js';
import app from './app.js';

const server = app.listen(env.port, () => {
  console.log(`Servidor activo en http://localhost:${env.port}`);
});

server.on('error', (error) => {
  console.error('No se pudo iniciar el servidor:', error.message);
  process.exit(1);
});