/**
 * Logger Configuration
 * Winston-based logging with file and console output
 */

const winston = require('winston');
const fs = require('fs');
const path = require('path');
const Constants = require('../constants/Constants');

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), Constants.LOG_DIR);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define custom log levels with colors
const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
    trace: 5,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
    trace: 'cyan',
  },
};

// Custom format for logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let metaStr = '';
    if (Object.keys(meta).length > 0) {
      metaStr = `\n${JSON.stringify(meta, null, 2)}`;
    }
    const stackStr = stack ? `\n${stack}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}${stackStr}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  levels: logLevels.levels,
  format: logFormat,
  defaultMeta: { service: 'playwright-tests' },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // All logs
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport in development/non-CI environments
if (!Constants.IS_CI || process.env.LOG_CONSOLE === 'true') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ colors: logLevels.colors }),
        winston.format.printf(
          ({ timestamp, level, message, ...meta }) => {
            let metaStr = '';
            if (Object.keys(meta).length > 0 && meta.service !== 'playwright-tests') {
              metaStr = ` ${JSON.stringify(meta)}`;
            }
            return `[${timestamp}] ${level} ${message}${metaStr}`;
          }
        )
      ),
    })
  );
}

// Add colors to log levels
winston.addColors(logLevels.colors);

/**
 * Logger wrapper with context methods
 */
class Logger {
  static debug(message, meta = {}) {
    logger.debug(message, meta);
  }

  static info(message, meta = {}) {
    logger.info(message, meta);
  }

  static warn(message, meta = {}) {
    logger.warn(message, meta);
  }

  static error(message, error = null, meta = {}) {
    if (error instanceof Error) {
      logger.error(message, { ...meta, error: error.message, stack: error.stack });
    } else {
      logger.error(message, { ...meta, error });
    }
  }

  static http(message, meta = {}) {
    logger.http(message, meta);
  }

  static trace(message, meta = {}) {
    logger.log('trace', message, meta);
  }

  /**
   * Log test step
   */
  static step(stepNumber, description, meta = {}) {
    this.info(`[STEP ${stepNumber}] ${description}`, meta);
  }

  /**
   * Log assertion
   */
  static assert(expected, actual, passed, meta = {}) {
    const status = passed ? '✓ PASS' : '✗ FAIL';
    this.info(`[ASSERTION] ${status} - Expected: ${expected}, Actual: ${actual}`, meta);
  }

  /**
   * Log page navigation
   */
  static navigation(url, meta = {}) {
    this.info(`[NAVIGATION] Navigating to: ${url}`, meta);
  }

  /**
   * Log API call
   */
  static apiCall(method, url, status, duration = 0, meta = {}) {
    const statusColor = status >= 200 && status < 300 ? 'success' : 'error';
    this.http(`[API] ${method} ${url} - Status: ${status} (${duration}ms)`, {
      ...meta,
      method,
      url,
      status,
      duration,
    });
  }

  /**
   * Log performance metric
   */
  static performance(metric, value, unit = 'ms', meta = {}) {
    this.info(`[PERF] ${metric}: ${value}${unit}`, meta);
  }

  /**
   * Get logger instance for advanced usage
   */
  static getInstance() {
    return logger;
  }
}

module.exports = Logger;
