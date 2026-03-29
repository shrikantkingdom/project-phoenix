/**
 * Wait Utilities
 * Custom wait conditions and verification methods for better readability
 */

const Logger = require('./Logger');
const Constants = require('../constants/Constants');
const { LocatorError, TimeoutError } = require('../errors/CustomError');

class WaitUtils {
  /**
   * Wait for element to be visible
   */
  static async waitForElementVisible(page, selector, timeout = Constants.ELEMENT_TIMEOUT) {
    try {
      Logger.debug(`Waiting for element visible: ${selector}`);
      await page.waitForSelector(selector, { timeout, state: 'visible' });
      Logger.debug(`Element visible: ${selector}`);
    } catch (error) {
      Logger.error(`Element not visible: ${selector}`, error);
      throw new LocatorError(selector, page, 'Element not visible within timeout');
    }
  }

  /**
   * Wait for element to be hidden
   */
  static async waitForElementHidden(page, selector, timeout = Constants.ELEMENT_TIMEOUT) {
    try {
      Logger.debug(`Waiting for element hidden: ${selector}`);
      await page.waitForSelector(selector, { timeout, state: 'hidden' });
      Logger.debug(`Element hidden: ${selector}`);
    } catch (error) {
      Logger.error(`Element did not hide: ${selector}`, error);
      throw new TimeoutError(`element to hide: ${selector}`, timeout);
    }
  }

  /**
   * Wait for element to be enabled
   */
  static async waitForElementEnabled(page, selector, timeout = Constants.ELEMENT_TIMEOUT) {
    try {
      Logger.debug(`Waiting for element enabled: ${selector}`);
      await page.waitForFunction(
        (sel) => {
          const element = document.querySelector(sel);
          return element && !element.disabled;
        },
        selector,
        { timeout }
      );
      Logger.debug(`Element enabled: ${selector}`);
    } catch (error) {
      Logger.error(`Element not enabled: ${selector}`, error);
      throw new TimeoutError(`element to be enabled: ${selector}`, timeout);
    }
  }

  /**
   * Wait for element to be disabled
   */
  static async waitForElementDisabled(page, selector, timeout = Constants.ELEMENT_TIMEOUT) {
    try {
      Logger.debug(`Waiting for element disabled: ${selector}`);
      await page.waitForFunction(
        (sel) => {
          const element = document.querySelector(sel);
          return element && element.disabled;
        },
        selector,
        { timeout }
      );
      Logger.debug(`Element disabled: ${selector}`);
    } catch (error) {
      Logger.error(`Element not disabled: ${selector}`, error);
      throw new TimeoutError(`element to be disabled: ${selector}`, timeout);
    }
  }

  /**
   * Wait for text to appear on page
   */
  static async waitForText(page, text, timeout = Constants.ELEMENT_TIMEOUT) {
    try {
      Logger.debug(`Waiting for text: "${text}"`);
      await page.waitForFunction(
        (t) => document.body.innerText.includes(t),
        text,
        { timeout }
      );
      Logger.debug(`Text found: "${text}"`);
    } catch (error) {
      Logger.error(`Text not found: "${text}"`, error);
      throw new TimeoutError(`text "${text}" to appear`, timeout);
    }
  }

  /**
   * Wait for text to be removed from page
   */
  static async waitForTextToDisappear(page, text, timeout = Constants.ELEMENT_TIMEOUT) {
    try {
      Logger.debug(`Waiting for text to disappear: "${text}"`);
      await page.waitForFunction(
        (t) => !document.body.innerText.includes(t),
        text,
        { timeout }
      );
      Logger.debug(`Text disappeared: "${text}"`);
    } catch (error) {
      Logger.error(`Text still visible: "${text}"`, error);
      throw new TimeoutError(`text "${text}" to disappear`, timeout);
    }
  }

  /**
   * Wait for element attribute value
   */
  static async waitForAttribute(
    page,
    selector,
    attribute,
    value,
    timeout = Constants.ELEMENT_TIMEOUT
  ) {
    try {
      Logger.debug(`Waiting for ${selector} to have ${attribute}="${value}"`);
      await page.waitForFunction(
        ({ sel, attr, val }) => {
          const element = document.querySelector(sel);
          return element && element.getAttribute(attr) === val;
        },
        { sel: selector, attr: attribute, val: value },
        { timeout }
      );
      Logger.debug(`Attribute verified: ${selector} ${attribute}="${value}"`);
    } catch (error) {
      Logger.error(`Attribute condition not met: ${selector}`, error);
      throw new TimeoutError(`attribute ${attribute}="${value}"`, timeout);
    }
  }

  /**
   * Wait for page to load (ready state)
   */
  static async waitForPageLoad(page, timeout = Constants.NAVIGATION_TIMEOUT) {
    try {
      Logger.debug('Waiting for page to load');
      await page.waitForLoadState('domcontentloaded', { timeout });
      Logger.debug('Page loaded');
    } catch (error) {
      Logger.error('Page load timeout', error);
      throw new TimeoutError('page to load', timeout);
    }
  }

  /**
   * Wait for navigation to complete
   */
  static async waitForNavigation(page, timeout = Constants.NAVIGATION_TIMEOUT) {
    try {
      Logger.debug('Waiting for navigation');
      await page.waitForLoadState('networkidle', { timeout });
      Logger.debug('Navigation complete');
    } catch (error) {
      Logger.warn('Navigation wait timeout (page may still be ready)', { error: error.message });
    }
  }

  /**
   * Wait for URL to change
   */
  static async waitForURLChange(page, previousURL, timeout = Constants.NAVIGATION_TIMEOUT) {
    try {
      Logger.debug(`Waiting for URL to change from: ${previousURL}`);
      await page.waitForFunction(
        (prevURL) => window.location.href !== prevURL,
        previousURL,
        { timeout }
      );
      Logger.info(`URL changed to: ${page.url()}`);
    } catch (error) {
      Logger.error('URL did not change', error);
      throw new TimeoutError('URL to change', timeout);
    }
  }

  /**
   * Wait for URL to contain specific string
   */
  static async waitForURLContains(page, urlPart, timeout = Constants.NAVIGATION_TIMEOUT) {
    try {
      Logger.debug(`Waiting for URL to contain: ${urlPart}`);
      await page.waitForFunction(
        (url) => window.location.href.includes(url),
        urlPart,
        { timeout }
      );
      Logger.debug(`URL contains: ${urlPart}`);
    } catch (error) {
      Logger.error(`URL does not contain: ${urlPart}`, error);
      throw new TimeoutError(`URL to contain "${urlPart}"`, timeout);
    }
  }

  /**
   * Wait for number of elements to match expected count
   */
  static async waitForElementCount(
    page,
    selector,
    expectedCount,
    timeout = Constants.ELEMENT_TIMEOUT
  ) {
    try {
      Logger.debug(`Waiting for ${selector} count to be ${expectedCount}`);
      await page.waitForFunction(
        ({ sel, count }) => document.querySelectorAll(sel).length === count,
        { sel: selector, count: expectedCount },
        { timeout }
      );
      Logger.debug(`Element count verified: ${selectedCount} = ${expectedCount}`);
    } catch (error) {
      Logger.error(`Element count mismatch for ${selector}`, error);
      throw new TimeoutError(`element count to be ${expectedCount}`, timeout);
    }
  }

  /**
   * Wait for function to return true
   */
  static async waitForFunction(page, fn, timeout = Constants.DEFAULT_TIMEOUT) {
    try {
      Logger.debug('Waiting for custom function condition');
      await page.waitForFunction(fn, { timeout });
      Logger.debug('Function condition met');
    } catch (error) {
      Logger.error('Function condition timeout', error);
      throw new TimeoutError('custom function', timeout);
    }
  }

  /**
   * Wait with custom message and timeout
   */
  static async wait(page, condition, message = 'Condition', timeout = Constants.DEFAULT_TIMEOUT) {
    try {
      Logger.debug(`Waiting for: ${message}`);
      await this.waitForFunction(page, condition, timeout);
      Logger.info(`${message} - OK`);
    } catch (error) {
      Logger.error(`${message} - FAILED`, error);
      throw new TimeoutError(message, timeout);
    }
  }
}

module.exports = WaitUtils;
