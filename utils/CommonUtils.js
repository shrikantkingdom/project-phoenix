/**
 * Common Utilities
 * Reusable utility functions for common test operations
 */

const Logger = require('./Logger');
const Constants = require('../constants/Constants');

class CommonUtils {
  /**
   * Delay execution by specified milliseconds
   */
  static async delay(ms = 1000) {
    Logger.debug(`Delaying for ${ms}ms`);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Wait for condition with retries
   */
  static async waitForCondition(
    condition,
    timeout = Constants.DEFAULT_TIMEOUT,
    interval = 100,
    errorMessage = 'Condition not met'
  ) {
    const startTime = Date.now();
    let lastError;

    while (Date.now() - startTime < timeout) {
      try {
        const result = await condition();
        if (result) {
          Logger.debug('Condition met successfully');
          return true;
        }
      } catch (error) {
        lastError = error;
      }

      await this.delay(interval);
    }

    Logger.error(`Condition timeout after ${timeout}ms: ${errorMessage}`, lastError);
    throw new Error(`${errorMessage} (timeout: ${timeout}ms)`);
  }

  /**
   * Retry operation with exponential backoff
   */
  static async retry(
    operation,
    retries = Constants.MAX_RETRIES,
    delayMs = Constants.RETRY_INTERVAL,
    backoffMultiplier = 1.5
  ) {
    let lastError;
    let currentDelay = delayMs;

    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        Logger.debug(`Attempt ${attempt}/${retries + 1}`);
        return await operation();
      } catch (error) {
        lastError = error;
        Logger.warn(`Attempt ${attempt} failed`, { error: error.message });

        if (attempt <= retries) {
          Logger.debug(`Retrying after ${currentDelay}ms`);
          await this.delay(currentDelay);
          currentDelay = Math.ceil(currentDelay * backoffMultiplier);
        }
      }
    }

    Logger.error(`All ${retries + 1} retry attempts failed`, lastError);
    throw lastError;
  }

  /**
   * Generate random string
   */
  static generateRandomString(length = 8, charset = 'abcdefghijklmnopqrstuvwxyz0123456789') {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  /**
   * Generate random email
   */
  static generateRandomEmail() {
    return `test_${this.generateRandomString(8)}@example.com`;
  }

  /**
   * Format number with commas
   */
  static formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Extract numbers from string
   */
  static extractNumbers(str) {
    return str.match(/\d+/g) || [];
  }

  /**
   * Extract text from string (remove numbers and special chars)
   */
  static extractText(str) {
    return str.replace(/[^a-zA-Z\s]/g, '').trim();
  }

  /**
   * Convert string to title case
   */
  static toTitleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Check if string matches pattern
   */
  static matchesPattern(str, pattern) {
    if (typeof pattern === 'string') {
      // Convert string pattern to regex
      const regex = new RegExp(pattern);
      return regex.test(str);
    }
    // Assume pattern is already a regex
    return pattern.test(str);
  }

  /**
   * Parse URL and get components
   */
  static parseURL(url) {
    try {
      const urlObj = new URL(url);
      return {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
      };
    } catch (error) {
      Logger.error('Failed to parse URL', error, { url });
      throw error;
    }
  }

  /**
   * Check if value is empty
   */
  static isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  /**
   * Deep clone object
   */
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Merge objects
   */
  static mergeObjects(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.mergeObjects(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  /**
   * Get value from nested object
   */
  static getNestedValue(obj, path, defaultValue = null) {
    const keys = path.split('.');
    let value = obj;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }

    return value;
  }

  /**
   * Format date
   */
  static formatDate(date, format = 'YYYY-MM-DD') {
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Get current timestamp
   */
  static getCurrentTimestamp() {
    return this.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
  }

  /**
   * Convert milliseconds to human readable time
   */
  static msToTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    return {
      hours,
      minutes,
      seconds,
      formatted: `${hours}h ${minutes}m ${seconds}s`,
    };
  }
}

module.exports = CommonUtils;
