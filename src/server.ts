import { app } from './app';
import { env } from './config/env';
import { testDatabaseConnection } from './config/database';

async function startServer() {
  console.log('🚀 Iniciando servidor...');

  // Probar conexión a la base de datos
  const dbConnected = await testDatabaseConnection();

  if (!dbConnected) {
    console.error(
      '❌ No se pudo establecer conexión a la base de datos. El servidor se detendrá.'
    );
    process.exit(1);
  }

  app.listen(env.PORT, () => {
    console.log(`✅ Server running on port ${env.PORT}`);
    console.log(`🌐 http://localhost:${env.PORT}`);
  });
}

startServer().catch((error) => {
  console.error('❌ Error al iniciar el servidor:', error);
  process.exit(1);
});
