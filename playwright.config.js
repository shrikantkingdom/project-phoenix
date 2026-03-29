/**
 * Playwright Configuration - Enhanced with logging, hooks, and multiple reporters
 * @link https://playwright.dev/docs/test-configuration
 */

const path = require('path');
require('dotenv').config();

// Import after dotenv config
const Logger = require('./utils/Logger');
const Constants = require('./constants/Constants');

module.exports = {
  // Test configuration
  testDir: path.join(__dirname, 'tests'),
  testMatch: '**/*.spec.js',
  fullyParallel: false, // Run tests sequentially for consistent logging
  forbidOnly: !!Constants.IS_CI,
  retries: Constants.IS_CI ? 1 : 0,
  workers: Constants.IS_CI ? 1 : 1,
  timeout: Constants.DEFAULT_TIMEOUT * 2,
  
  expect: {
    timeout: Constants.DEFAULT_TIMEOUT,
  },

  // Global setup and teardown
  globalSetup: path.join(__dirname, 'config/globalSetup.js'),
  globalTeardown: path.join(__dirname, 'config/globalTeardown.js'),

  // Reporter configuration - Multiple formats for different needs
  reporter: [
    ['html', { 
      outputFolder: path.join(__dirname, 'reports/html'),
      open: Constants.IS_CI ? 'never' : 'on-failure',
    }],
    ['json', { 
      outputFile: path.join(__dirname, 'reports/test-results.json'),
    }],
    ['junit', { 
      outputFile: path.join(__dirname, 'reports/junit.xml'),
    }],
    ['list'], // Console output
    ['github'], // GitHub Actions integration
  ],

  // Output directory for artifacts
  outputFolder: path.join(__dirname, 'reports/artifacts'),

  // Shared browser settings
  use: {
    baseURL: Constants.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: Constants.NAVIGATION_TIMEOUT,
    actionTimeout: Constants.ACTION_TIMEOUT,
    viewport: Constants.VIEWPORT,
    ignoreHTTPSErrors: true,
  },

  // Browser configurations
  projects: [
    {
      name: 'chromium',
      use: {
        ...require('@playwright/test').devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox',
      use: {
        ...require('@playwright/test').devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: {
        ...require('@playwright/test').devices['Desktop Safari'],
      },
    },
  ],
};

