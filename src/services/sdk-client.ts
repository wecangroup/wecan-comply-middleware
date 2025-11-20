import { WecanComply } from 'wecan-comply-sdk-js';
import { config, sensitiveConfig } from '../config/index.js';
import { logger } from '../utils/logger.js';

let sdkClient: WecanComply | null = null;

/**
 * Initialize and get the WecanComply SDK client instance
 */
export async function getSDKClient(): Promise<WecanComply> {
  if (sdkClient) {
    return sdkClient;
  }

  if (!sensitiveConfig.accessToken) {
    throw new Error('WECAN_ACCESS_TOKEN must be set in environment variables');
  }

  try {
    logger.info('Initializing WecanComply SDK client...');
    
    sdkClient = await WecanComply.create({
      accessToken: sensitiveConfig.accessToken,
      workspaceUrlTemplate: config.wecanComply.workspaceUrlTemplate,
      timeoutMs: config.wecanComply.timeoutMs,
      retries: config.wecanComply.retries,
      onUnauthorized: (error) => {
        logger.error('Unauthorized error from SDK:', error);
      },
    });

    logger.info('WecanComply SDK client initialized successfully');
    return sdkClient;
  } catch (error) {
    logger.error('Failed to initialize WecanComply SDK client:', error);
    throw error;
  }
}

/**
 * Reset the SDK client (useful for testing or re-authentication)
 */
export function resetSDKClient(): void {
  sdkClient = null;
  logger.info('SDK client reset');
}

