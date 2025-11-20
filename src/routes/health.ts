import { Router, Request, Response } from 'express';
import { getSDKClient } from '../services/sdk-client.js';
import { logger } from '../utils/logger.js';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Verifies that the service is running and the SDK client is initialized
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 *             example:
 *               status: healthy
 *               timestamp: "2025-01-20T10:00:00.000Z"
 *               service: "wecan-comply-middleware"
 *       503:
 *         description: Service is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 *             example:
 *               status: unhealthy
 *               timestamp: "2025-01-20T10:00:00.000Z"
 *               service: "wecan-comply-middleware"
 *               error: "SDK client initialization failed"
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // Try to get SDK client to verify it's initialized
    await getSDKClient();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'wecan-comply-middleware',
    });
  } catch (error: any) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'wecan-comply-middleware',
      error: error.message,
    });
  }
});

export default router;

