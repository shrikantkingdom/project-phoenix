/**
 * Global Teardown - Runs once after all tests
 * Clean up resources, close connections, generate reports
 */

const Logger = require('../utils/Logger');
const fs = require('fs');
const path = require('path');
const Constants = require('../constants/Constants');

module.exports = async function globalTeardown() {
  Logger.info('═══════════════════════════════════════════════════════════');
  Logger.info('  TEST SUITE TEARDOWN');
  Logger.info('═══════════════════════════════════════════════════════════');

  Logger.info('[GlobalTeardown] Closing test suite');

  try {
    // Verify reports were generated
    const reportsDir = path.join(process.cwd(), Constants.REPORT_DIR);
    if (fs.existsSync(reportsDir)) {
      const files = fs.readdirSync(reportsDir);
      Logger.info(`[GlobalTeardown] Reports directory: ${reportsDir}`);
      Logger.info(`[GlobalTeardown] Generated files: ${files.join(', ')}`);
    }
  } catch (error) {
    Logger.warn('[GlobalTeardown] Report verification failed', { error: error.message });
  }

  try {
    // Generate summary
    const logsDir = path.join(process.cwd(), Constants.LOG_DIR);
    if (fs.existsSync(logsDir)) {
      const files = fs.readdirSync(logsDir);
      Logger.info(`[GlobalTeardown] Log files: ${files.length} files`);
    }
  } catch (error) {
    Logger.warn('[GlobalTeardown] Log verification failed', { error: error.message });
  }

  Logger.info('[GlobalTeardown] Cleanup complete');
  Logger.info('═══════════════════════════════════════════════════════════');
  Logger.info('');
};
