/**
 * Centralized logger for the Investa app.
 * Wraps console methods with a level-based system.
 * In production, only warn and error are enabled.
 */
import { Platform } from 'react-native';

const IS_DEV = __DEV__;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel = IS_DEV ? 'debug' : 'warn';
const minLevel = LOG_LEVELS[currentLevel];

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= minLevel;
}

const logger = {
  debug(message?: any, ...optionalParams: any[]) {
    if (shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, ...optionalParams);
    }
  },

  info(message?: any, ...optionalParams: any[]) {
    if (shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...optionalParams);
    }
  },

  warn(message?: any, ...optionalParams: any[]) {
    if (shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...optionalParams);
    }
  },

  error(message?: any, ...optionalParams: any[]) {
    if (shouldLog('error')) {
      console.error(`[ERROR] ${message}`, ...optionalParams);
    }
  },

  /**
   * Log API errors in a structured format.
   */
  apiError(endpoint: string, error: any) {
    if (shouldLog('error')) {
      const status = error?.response?.status || 'unknown';
      const detail = error?.response?.data?.detail || error?.message || 'unknown error';
      console.error(`[API ERROR] ${endpoint} (${status}): ${detail}`);
    }
  },
};

export default logger;
