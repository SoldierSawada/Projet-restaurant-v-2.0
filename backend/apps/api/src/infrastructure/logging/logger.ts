import { AsyncLocalStorage } from 'node:async_hooks';
import path from 'node:path';
import winston from 'winston';
import { sanitize } from './sanitize';

export interface RequestContext {
  requestId: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

const levels = ['error', 'warn', 'info', 'http', 'debug'];

function levelFromEnv(): string {
  const value = (process.env.LOG_LEVEL ?? 'info').toLowerCase();

  return levels.includes(value) ? value : 'info';
}

const addRequestId = winston.format((info) => {
  const context = requestContext.getStore();

  if (context) {
    info.requestId = context.requestId;
  }

  return info;
});

const sanitizeMetadata = winston.format((info) => {
  for (const key of Object.keys(info)) {
    if (!['level', 'message', 'timestamp'].includes(key)) {
      info[key] = sanitize(info[key]);
    }
  }

  return info;
});

const transports: winston.transport[] = [new winston.transports.Console()];

if (process.env.LOG_TO_FILE === 'true') {
  const logDir = process.env.LOG_DIR ?? 'logs';
  const rotation = { maxsize: 5 * 1024 * 1024, maxFiles: 5, tailable: true };

  transports.push(
    new winston.transports.File({ filename: path.join(logDir, 'app.log'), ...rotation }),
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error', ...rotation }),
  );
}

export const logger = winston.createLogger({
  level: levelFromEnv(),
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    addRequestId(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    sanitizeMetadata(),
    winston.format.json(),
  ),
  defaultMeta: { service: process.env.SERVICE_NAME ?? 'restaurant-api' },
  transports,
  exitOnError: false,
});

export function setLogLevel(level: string): void {
  if (levels.includes(level)) {
    logger.level = level;
  }
}
