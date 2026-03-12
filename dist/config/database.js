"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.testDatabaseConnection = testDatabaseConnection;
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = require("./env");
exports.db = promise_1.default.createPool({
    host: env_1.env.DB_HOST,
    port: env_1.env.DB_PORT,
    user: env_1.env.DB_USER,
    password: env_1.env.DB_PASSWORD,
    database: env_1.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
// Función para probar la conexión a la base de datos
async function testDatabaseConnection() {
    try {
        console.log('🔍 Intentando conectar a la base de datos...');
        console.log(`📍 Host: ${env_1.env.DB_HOST}:${env_1.env.DB_PORT}`);
        console.log(`🗄️  Database: ${env_1.env.DB_NAME}`);
        console.log(`👤 User: ${env_1.env.DB_USER}`);
        const connection = await exports.db.getConnection();
        console.log('✅ Conexión a la base de datos establecida exitosamente');
        // Probar una consulta simple
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Consulta de prueba ejecutada correctamente:', rows);
        connection.release();
        console.log('🔗 Conexión liberada');
        return true;
    }
    catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
        return false;
    }
}
