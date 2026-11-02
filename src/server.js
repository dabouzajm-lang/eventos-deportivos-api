import { env } from './config/env.config.js';
import { connectDatabase } from './config/database.config.js';
import app from './app.js';

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(env.port, () => {
      console.log(`Servidor activo en http://localhost:${env.port}`);
    });

    server.on('error', (error) => {
      console.error('No se pudo iniciar el servidor:', error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error('No se pudo conectar a MongoDB.');
    console.error('Tipo:', error.name);
    console.error('Código:', error.code ?? 'Sin código');
    console.error('Detalle:', error.message);

    for (const server of error.reason?.servers?.values() ?? []) {
      if (server.error) {
        console.error('Error del servidor:', server.error.message);
      }
    }

    process.exit(1);
  }
};

startServer();