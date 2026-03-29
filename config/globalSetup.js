/**
 * Global Setup - Runs once before all tests
 * Initialize test environment, set up database, etc.
 */

const Logger = require('../utils/Logger');
const Constants = require('../constants/Constants');

module.exports = async function globalSetup() {
  Logger.info('═══════════════════════════════════════════════════════════');
  Logger.info('  PROJECT PHOENIX - AUTOMATION TEST SUITE');
  Logger.info('═══════════════════════════════════════════════════════════');
  
  Logger.info('[GlobalSetup] Starting test suite initialization');
  Logger.info(`[GlobalSetup] Environment: ${Constants.ENVIRONMENT}`);
  Logger.info(`[GlobalSetup] Base URL: ${Constants.BASE_URL}`);
  Logger.info(`[GlobalSetup] CI Environment: ${Constants.IS_CI}`);
  Logger.info(`[GlobalSetup] Headless: ${Constants.HEADLESS}`);
  Logger.info(`[GlobalSetup] Log Level: ${Constants.LOG_LEVEL}`);

  // Verify critical configuration
  try {
    if (!Constants.BASE_URL) {
      throw new Error('BASE_URL not configured');
    }
    Logger.info('[GlobalSetup] Configuration validation passed');
  } catch (error) {
    Logger.error('[GlobalSetup] Configuration validation failed', error);
    throw error;
  }

  // Initialize test data if needed
  try {
    Logger.info('[GlobalSetup] Test data initialization');
    Logger.info(`[GlobalSetup] Valid user configured: ${Constants.VALID_USER.username}`);
  } catch (error) {
    Logger.warn('[GlobalSetup] Test data initialization warning', { error: error.message });
  }

  Logger.info('[GlobalSetup] Test suite initialization complete');
  Logger.info('═══════════════════════════════════════════════════════════');
  Logger.info('');
};
