import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { errorHandler, notFound } from './middleware/errorHandler';
import routes from './routes';
import { testDatabaseConnection } from './config/database';

export const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors());

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('dev'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// Health check endpoint
app.get('/', async (req, res) => {
  const dbStatus = await testDatabaseConnection();

  res.json({
    success: true,
    message: 'API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      connected: dbStatus,
      status: dbStatus ? 'connected' : 'disconnected',
    },
  });
});

// Database health check endpoint
app.get('/health/db', async (req, res) => {
  const dbStatus = await testDatabaseConnection();

  res.json({
    database: {
      connected: dbStatus,
      status: dbStatus ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    },
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);
