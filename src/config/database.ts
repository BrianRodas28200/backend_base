import mysql from 'mysql2/promise';
import { env } from './env';

export const db = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Función para probar la conexión a la base de datos
export async function testDatabaseConnection() {
  try {
    console.log('🔍 Intentando conectar a la base de datos...');
    console.log(`📍 Host: ${env.DB_HOST}:${env.DB_PORT}`);
    console.log(`🗄️  Database: ${env.DB_NAME}`);
    console.log(`👤 User: ${env.DB_USER}`);

    const connection = await db.getConnection();
    console.log('✅ Conexión a la base de datos establecida exitosamente');

    // Probar una consulta simple
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Consulta de prueba ejecutada correctamente:', rows);

    connection.release();
    console.log('🔗 Conexión liberada');

    return true;
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    return false;
  }
}
