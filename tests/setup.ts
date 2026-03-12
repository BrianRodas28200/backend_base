import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test defaults
process.env.NODE_ENV = 'test';
process.env.PORT = '3101';
process.env.DB_NAME = 'gestionpro_test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

// Increase timeout for database operations
jest.setTimeout(30000);
