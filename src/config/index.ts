import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

interface ServerConfig {
  port: number;
  host: string;
}

interface WecanComplyConfig {
  workspaceUrlTemplate: string;
  timeoutMs: number;
  retries: number;
}

interface LoggingConfig {
  level: string;
  format: string;
}

interface CorsConfig {
  enabled: boolean;
  origin: string;
}

interface AppConfig {
  server: ServerConfig;
  wecanComply: WecanComplyConfig;
  logging: LoggingConfig;
  cors: CorsConfig;
}

// Load default config
const defaultConfigPath = join(__dirname, '../../config/default.json');
const defaultConfig: AppConfig = JSON.parse(readFileSync(defaultConfigPath, 'utf-8'));

// Override with environment variables
export const config: AppConfig = {
  server: {
    port: parseInt(process.env.PORT || String(defaultConfig.server.port), 10),
    host: process.env.HOST || defaultConfig.server.host,
  },
  wecanComply: {
    workspaceUrlTemplate: process.env.WECAN_WORKSPACE_URL_TEMPLATE || defaultConfig.wecanComply.workspaceUrlTemplate,
    timeoutMs: parseInt(process.env.WECAN_TIMEOUT_MS || String(defaultConfig.wecanComply.timeoutMs), 10),
    retries: parseInt(process.env.WECAN_RETRIES || String(defaultConfig.wecanComply.retries), 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || defaultConfig.logging.level,
    format: process.env.LOG_FORMAT || defaultConfig.logging.format,
  },
  cors: {
    enabled: process.env.CORS_ENABLED !== 'false',
    origin: process.env.CORS_ORIGIN || defaultConfig.cors.origin,
  },
};

// Sensitive values from environment
export const sensitiveConfig = {
  accessToken: process.env.WECAN_ACCESS_TOKEN,
};

