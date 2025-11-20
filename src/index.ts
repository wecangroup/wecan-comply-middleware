import express from 'express';
import https from 'https';
import http from 'http';
import { readFileSync } from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { swaggerSpec } from './config/swagger.js';

// Routes
import healthRouter from './routes/health.js';
import workspaceRouter from './routes/workspace.js';
import vaultRouter from './routes/vault.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
if (config.cors.enabled) {
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: true,
    })
  );
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Wecan Comply Middleware API Documentation',
}));

// Routes
app.use('/health', healthRouter);
app.use('/api/workspaces', workspaceRouter);
app.use('/api/workspaces', vaultRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
  });
});

// Start server
const PORT = config.server.port;
const HOST = config.server.host;

// HTTPS configuration
if (config.server.https?.enabled) {
  const { keyPath, certPath } = config.server.https;
  
  if (!keyPath || !certPath) {
    logger.error('HTTPS is enabled but HTTPS_KEY_PATH and HTTPS_CERT_PATH are not set');
    process.exit(1);
  }

  try {
    const httpsOptions = {
      key: readFileSync(keyPath),
      cert: readFileSync(certPath),
    };

    const httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(PORT, HOST, () => {
      logger.info(`HTTPS server started on https://${HOST}:${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown for HTTPS
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down HTTPS server gracefully');
      httpsServer.close(() => {
        logger.info('HTTPS server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down HTTPS server gracefully');
      httpsServer.close(() => {
        logger.info('HTTPS server closed');
        process.exit(0);
      });
    });
  } catch (error: any) {
    logger.error('Failed to start HTTPS server:', error);
    logger.error(`Make sure the certificate files exist at: ${keyPath} and ${certPath}`);
    process.exit(1);
  }
} else {
  // HTTP server (default)
  const httpServer = http.createServer(app);
  httpServer.listen(PORT, HOST, () => {
    logger.info(`HTTP server started on http://${HOST}:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Graceful shutdown for HTTP
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down HTTP server gracefully');
    httpServer.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down HTTP server gracefully');
    httpServer.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  });
}


