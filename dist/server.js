"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const database_1 = require("./config/database");
async function startServer() {
    console.log('🚀 Iniciando servidor...');
    // Probar conexión a la base de datos
    const dbConnected = await (0, database_1.testDatabaseConnection)();
    if (!dbConnected) {
        console.error('❌ No se pudo establecer conexión a la base de datos. El servidor se detendrá.');
        process.exit(1);
    }
    app_1.app.listen(env_1.env.PORT, () => {
        console.log(`✅ Server running on port ${env_1.env.PORT}`);
        console.log(`🌐 http://localhost:${env_1.env.PORT}`);
    });
}
startServer().catch((error) => {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
});
