import { WecanComply, WorkspaceKeyConfig } from 'wecan-comply-sdk-js';
import { config, sensitiveConfig } from '../config/index.js';
import { logger } from '../utils/logger.js';

let sdkClient: WecanComply | null = null;

/**
 * Parse workspace keys from environment variable or JSON string
 */
function parseWorkspaceKeys(): WorkspaceKeyConfig[] | undefined {
  const workspaceKeysEnv = process.env.WECAN_WORKSPACE_KEYS;
  if (!workspaceKeysEnv) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(workspaceKeysEnv);
    if (Array.isArray(parsed)) {
      return parsed as WorkspaceKeyConfig[];
    }
    logger.warn('WECAN_WORKSPACE_KEYS must be a JSON array');
    return undefined;
  } catch (error) {
    logger.error('Failed to parse WECAN_WORKSPACE_KEYS:', error);
    return undefined;
  }
}

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
    
    const workspaceKeys = parseWorkspaceKeys();
    if (workspaceKeys) {
      logger.info(`Loading ${workspaceKeys.length} workspace key(s) for encryption/decryption`);
    }
    
    sdkClient = await WecanComply.create({
      accessToken: sensitiveConfig.accessToken,
      workspaceKeys,
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

