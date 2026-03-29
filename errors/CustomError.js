/**
 * Custom Error Classes
 * Base class for all custom errors with improved error messaging
 */

class CustomError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Get complete error information for logging
   */
  getFullInfo() {
    return {
      name: this.name,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }

  /**
   * Get formatted error message
   */
  getFormattedMessage() {
    return `[${this.name}] ${this.message}\nDetails: ${JSON.stringify(this.details, null, 2)}`;
  }
}

/**
 * Locator/Element Not Found Error
 */
class LocatorError extends CustomError {
  constructor(selector, page = null, fallbackSelector = null) {
    const message = `Element not found with selector: "${selector}"`;
    super(message, {
      selector,
      fallbackSelector,
      pageUrl: page?.url?.() || 'Unknown',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Timeout Error
 */
class TimeoutError extends CustomError {
  constructor(action, timeout, context = '') {
    const message = `Timeout after ${timeout}ms while ${action}`;
    super(message, {
      action,
      timeout,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Navigation Error
 */
class NavigationError extends CustomError {
  constructor(url, error, context = '') {
    const message = `Failed to navigate to ${url}`;
    super(message, {
      url,
      originalError: error?.message || error,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * API Error
 */
class APIError extends CustomError {
  constructor(method, url, status, response, error = null) {
    const message = `API ${method} ${url} failed with status ${status}`;
    super(message, {
      method,
      url,
      status,
      response: response?.slice?.(0, 500) || response, // Limit response size
      error: error?.message || error,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Assertion Error
 */
class AssertionError extends CustomError {
  constructor(expected, actual, message = '') {
    const msg = message || `Assertion failed: expected "${expected}" but got "${actual}"`;
    super(msg, {
      expected,
      actual,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Configuration Error
 */
class ConfigError extends CustomError {
  constructor(configKey, issue = '') {
    const message = `Configuration error for "${configKey}": ${issue}`;
    super(message, {
      configKey,
      issue,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Framework Error
 */
class FrameworkError extends CustomError {
  constructor(message, stage = '', context = {}) {
    super(message, {
      stage,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = {
  CustomError,
  LocatorError,
  TimeoutError,
  NavigationError,
  APIError,
  AssertionError,
  ConfigError,
  FrameworkError,
};
