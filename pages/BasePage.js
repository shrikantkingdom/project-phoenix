/**
 * BasePage - Base class for all page objects with setup/teardown hooks
 * Provides common functionality and lifecycle management
 */

const Logger = require('../utils/Logger');
const Constants = require('../constants/Constants');
const WaitUtils = require('../utils/WaitUtils');
const AssertUtils = require('../utils/AssertUtils');
const CommonUtils = require('../utils/CommonUtils');

class BasePage {
  constructor(page) {
    this.page = page;
    this.logger = Logger;
    this.waitUtils = WaitUtils;
    this.assertUtils = AssertUtils;
    this.commonUtils = CommonUtils;
    this.timeout = Constants.DEFAULT_TIMEOUT;
    this.navigationTimeout = Constants.NAVIGATION_TIMEOUT;
    this.baseUrl = Constants.BASE_URL;
  }

  /**
   * Setup hook - called before each test
   */
  async beforeEach() {
    Logger.info('[BasePage] Setup: beforeEach hook');
    try {
      // Add any global setup logic here
      await this.clearBrowserStorage();
      Logger.debug('[BasePage] Browser storage cleared');
    } catch (error) {
      Logger.warn('[BasePage] Setup cleanup error', { error: error.message });
    }
  }

  /**
   * Teardown hook - called after each test
   */
  async afterEach() {
    Logger.info('[BasePage] Teardown: afterEach hook');
    try {
      // Capture screenshot on failure (can be enhanced with test status)
      // await this.takeScreenshot('afterEach');

      // Clear any dialogs
      await this.handleDialogs();

      Logger.debug('[BasePage] Teardown complete');
    } catch (error) {
      Logger.warn('[BasePage] Teardown error', { error: error.message });
    }
  }

  /**
   * Navigate to URL
   */
  async goto(url, options = {}) {
    try {
      const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
      Logger.navigation(fullUrl);

      const defaultOptions = {
        waitUntil: 'domcontentloaded',
        timeout: this.navigationTimeout,
        ...options,
      };

      await this.page.goto(fullUrl, defaultOptions);
      Logger.info(`[BasePage] Navigated to ${fullUrl}`);

      await this.waitUtils.waitForPageLoad(this.page);
    } catch (error) {
      Logger.error(`[BasePage] Navigation failed to ${url}`, error);
      throw error;
    }
  }

  /**
   * Navigate back
   */
  async goBack() {
    try {
      Logger.info('[BasePage] Going back');
      await this.page.goBack();
      await this.waitUtils.waitForNavigation(this.page);
    } catch (error) {
      Logger.warn('[BasePage] Go back failed', { error: error.message });
    }
  }

  /**
   * Navigate forward
   */
  async goForward() {
    try {
      Logger.info('[BasePage] Going forward');
      await this.page.goForward();
      await this.waitUtils.waitForNavigation(this.page);
    } catch (error) {
      Logger.warn('[BasePage] Go forward failed', { error: error.message });
    }
  }

  /**
   * Get current URL
   */
  getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Click element
   */
  async click(selector, options = {}) {
    try {
      Logger.debug(`[BasePage] Clicking element: ${selector}`);
      await this.waitUtils.waitForElementVisible(this.page, selector);
      await this.page.click(selector, { timeout: this.timeout, ...options });
      Logger.info(`[BasePage] Clicked: ${selector}`);
    } catch (error) {
      Logger.error(`[BasePage] Click failed: ${selector}`, error);
      throw error;
    }
  }

  /**
   * Type text into element
   */
  async type(selector, text, options = {}) {
    try {
      Logger.debug(`[BasePage] Typing "${text}" into ${selector}`);
      await this.waitUtils.waitForElementVisible(this.page, selector);
      await this.page.fill(selector, text, { timeout: this.timeout, ...options });
      Logger.info(`[BasePage] Typed into: ${selector}`);
    } catch (error) {
      Logger.error(`[BasePage] Type failed: ${selector}`, error);
      throw error;
    }
  }

  /**
   * Clear input field
   */
  async clear(selector) {
    try {
      Logger.debug(`[BasePage] Clearing: ${selector}`);
      await this.type(selector, '');
      Logger.info(`[BasePage] Cleared: ${selector}`);
    } catch (error) {
      Logger.error(`[BasePage] Clear failed: ${selector}`, error);
      throw error;
    }
  }

  /**
   * Get text from element
   */
  async getText(selector) {
    try {
      Logger.debug(`[BasePage] Getting text from: ${selector}`);
      await this.waitUtils.waitForElementVisible(this.page, selector);
      const text = await this.page.textContent(selector);
      Logger.debug(`[BasePage] Text content: "${text}"`);
      return text?.trim() || '';
    } catch (error) {
      Logger.error(`[BasePage] getText failed: ${selector}`, error);
      throw error;
    }
  }

  /**
   * Get attribute value
   */
  async getAttribute(selector, attribute) {
    try {
      Logger.debug(`[BasePage] Getting attribute "${attribute}" from: ${selector}`);
      await this.waitUtils.waitForElementVisible(this.page, selector);
      const value = await this.page.getAttribute(selector, attribute);
      Logger.debug(`[BasePage] Attribute value: "${value}"`);
      return value;
    } catch (error) {
      Logger.error(`[BasePage] getAttribute failed: ${selector}`, error);
      throw error;
    }
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector) {
    try {
      Logger.debug(`[BasePage] Checking visibility: ${selector}`);
      const isVisible = await this.page.isVisible(selector);
      Logger.debug(`[BasePage] Element visible: ${isVisible}`);
      return isVisible;
    } catch (error) {
      Logger.warn(`[BasePage] Visibility check failed: ${selector}`, { error: error.message });
      return false;
    }
  }

  /**
   * Check if element is enabled
   */
  async isElementEnabled(selector) {
    try {
      Logger.debug(`[BasePage] Checking enabled: ${selector}`);
      const isEnabled = await this.page.isEnabled(selector);
      Logger.debug(`[BasePage] Element enabled: ${isEnabled}`);
      return isEnabled;
    } catch (error) {
      Logger.warn(`[BasePage] Enabled check failed: ${selector}`, { error: error.message });
      return false;
    }
  }

  /**
   * Check if element exists
   */
  async isElementPresent(selector) {
    try {
      const element = await this.page.$(selector);
      const isPresent = element !== null;
      Logger.debug(`[BasePage] Element present: ${isPresent}`);
      return isPresent;
    } catch (error) {
      Logger.debug(`[BasePage] Element check failed: ${selector}`);
      return false;
    }
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector, value) {
    try {
      Logger.debug(`[BasePage] Selecting "${value}" from: ${selector}`);
      await this.page.selectOption(selector, value);
      Logger.info(`[BasePage] Selected: ${value}`);
    } catch (error) {
      Logger.error(`[BasePage] Select failed: ${selector}`, error);
      throw error;
    }
  }

  /**
   * Upload file
   */
  async uploadFile(selector, filePath) {
    try {
      Logger.debug(`[BasePage] Uploading file: ${filePath} to ${selector}`);
      await this.page.setInputFiles(selector, filePath);
      Logger.info(`[BasePage] File uploaded: ${filePath}`);
    } catch (error) {
      Logger.error(`[BasePage] File upload failed: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name = 'screenshot') {
    try {
      const timestamp = this.commonUtils.getCurrentTimestamp().replace(/[\s:]/g, '-');
      const filename = `${Constants.REPORT_DIR}/${name}-${timestamp}.png`;
      Logger.debug(`[BasePage] Taking screenshot: ${filename}`);
      await this.page.screenshot({ path: filename, fullPage: true });
      Logger.info(`[BasePage] Screenshot saved: ${filename}`);
      return filename;
    } catch (error) {
      Logger.warn(`[BasePage] Screenshot failed`, { error: error.message });
    }
  }

  /**
   * Get page source
   */
  async getPageSource() {
    try {
      return await this.page.content();
    } catch (error) {
      Logger.error('[BasePage] Get page source failed', error);
      throw error;
    }
  }

  /**
   * Handle any dialog boxes
   */
  async handleDialogs() {
    try {
      this.page.on('dialog', async (dialog) => {
        Logger.info(`[BasePage] Dialog detected: ${dialog.type()} - ${dialog.message()}`);
        await dialog.accept();
      });
    } catch (error) {
      Logger.warn('[BasePage] Dialog handler setup failed', { error: error.message });
    }
  }

  /**
   * Clear browser storage (localStorage, sessionStorage, cookies)
   */
  async clearBrowserStorage() {
    try {
      Logger.debug('[BasePage] Clearing browser storage');
      await this.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      // Clear cookies
      await this.page.context().clearCookies();
      Logger.debug('[BasePage] Browser storage cleared');
    } catch (error) {
      Logger.warn('[BasePage] Clear storage failed', { error: error.message });
    }
  }

  /**
   * Wait for function
   */
  async waitFor(fn, timeout = this.timeout) {
    try {
      await this.waitUtils.waitForFunction(this.page, fn, timeout);
    } catch (error) {
      Logger.error('[BasePage] Wait failed', error);
      throw error;
    }
  }

  /**
   * Execute JavaScript in page context
   */
  async executeScript(script, ...args) {
    try {
      Logger.debug('[BasePage] Executing script');
      const result = await this.page.evaluate(script, ...args);
      Logger.debug('[BasePage] Script execution complete');
      return result;
    } catch (error) {
      Logger.error('[BasePage] Script execution failed', error);
      throw error;
    }
  }
}

module.exports = BasePage;
