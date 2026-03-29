/**
 * Constants - Centralized configuration and constants
 * All hardcoded values and environment configuration in one place
 */

require('dotenv').config();

class Constants {
  // ========== ENVIRONMENT ==========
  static ENVIRONMENT = process.env.ENVIRONMENT || 'qa';
  static IS_CI = process.env.CI === 'true';
  static HEADLESS = process.env.HEADLESS !== 'false';

  // ========== BASE URLS ==========
  static BASE_URL = process.env.BASE_URL || 'https://the-internet.herokuapp.com';
  static API_BASE_URL = process.env.API_BASE_URL || 'https://the-internet.herokuapp.com';
  static ADMIN_URL = process.env.ADMIN_URL || 'https://admin.the-internet.herokuapp.com';

  // ========== TIMEOUTS (ms) ==========
  static DEFAULT_TIMEOUT = parseInt(process.env.DEFAULT_TIMEOUT || '5000');
  static NAVIGATION_TIMEOUT = parseInt(process.env.NAVIGATION_TIMEOUT || '30000');
  static ELEMENT_TIMEOUT = parseInt(process.env.ELEMENT_TIMEOUT || '5000');
  static ACTION_TIMEOUT = parseInt(process.env.ACTION_TIMEOUT || '3000');

  // ========== TEST USERS ==========
  static VALID_USER = {
    username: process.env.TEST_USERNAME || 'tomsmith',
    password: process.env.TEST_PASSWORD || 'SuperSecretPassword!',
    email: process.env.TEST_EMAIL || 'tomsmith@example.com',
  };

  static INVALID_USERS = [
    { username: 'invalid', password: 'wrongpassword' },
    { username: '', password: '' },
    { username: 'tomsmith', password: 'wrongpassword' },
    { username: 'test', password: 'test' },
  ];

  // ========== TEST DATA ==========
  static TEST_FILES = {
    sample: 'fixtures/sample.txt',
    pdf: 'fixtures/sample.pdf',
    image: 'fixtures/sample.png',
  };

  static TEST_DATA = {
    validEmail: 'test@example.com',
    invalidEmail: 'invalid-email',
    validPhoneNumber: '+1234567890',
    invalidPhoneNumber: '123',
    longText: 'a'.repeat(1000),
    specialCharacters: '!@#$%^&*()',
  };

  // ========== WAIT TIMES ==========
  static WAIT_FOR_NAVIGATION = 3000;
  static WAIT_FOR_ELEMENT = 5000;
  static WAIT_FOR_API = 10000;
  static DEBOUNCE_TIME = 500;

  // ========== RETRY SETTINGS ==========
  static MAX_RETRIES = process.env.MAX_RETRIES ? parseInt(process.env.MAX_RETRIES) : 2;
  static RETRY_INTERVAL = 1000; // ms

  // ========== BROWSER SETTINGS ==========
  static BROWSERS = ['chromium', 'firefox', 'webkit'];
  static VIEWPORT = { width: 1280, height: 720 };
  static DEVICE_SCALE_FACTOR = 1;

  // ========== LOGGING ==========
  static LOG_LEVEL = process.env.LOG_LEVEL || 'info';
  static LOG_DIR = 'logs';
  static REPORT_DIR = 'reports';

  // ========== SCREENSHOT & VIDEO ==========
  static SCREENSHOT_ON_FAILURE = true;
  static VIDEO_ON_FAILURE = true;
  static TRACE_ON_FAILURE = true;

  // ========== API SETTINGS ==========
  static API_TIMEOUT = 30000;
  static API_RETRIES = 2;
  static DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // ========== ENDPOINTS ==========
  static ENDPOINTS = {
    LOGIN: '/authenticate',
    UPLOAD: '/upload',
    LOGIN_PAGE: '/login',
    UPLOAD_PAGE: '/upload',
  };

  // ========== ERROR MESSAGES ==========
  static ERROR_MESSAGES = {
    ELEMENT_NOT_FOUND: 'Element not found',
    NAVIGATION_FAILED: 'Navigation failed',
    TIMEOUT: 'Operation timed out',
    API_ERROR: 'API request failed',
    AUTHENTICATION_FAILED: 'Authentication failed',
  };

  // ========== REGEX PATTERNS ==========
  static PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+?[\d\s\-()]*$/,
    URL: /^https?:\/\/.+/,
    SECURE_AREA: /\/secure/,
  };

  /**
   * Get value by key with optional default
   */
  static get(key, defaultValue = null) {
    return this[key] ?? defaultValue;
  }

  /**
   * Check if running in CI environment
   */
  static isCI() {
    return this.IS_CI;
  }

  /**
   * Get random invalid user
   */
  static getRandomInvalidUser() {
    return this.INVALID_USERS[Math.floor(Math.random() * this.INVALID_USERS.length)];
  }
}

module.exports = Constants;
