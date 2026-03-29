/**
 * PlaywrightFactory - Centralized browser and page lifecycle management
 * Handles fixture pooling, resource cleanup, and reuse
 */

const { chromium, firefox, webkit } = require('@playwright/test');
const Constants = require('../constants/Constants');
const Logger = require('../utils/Logger');

class PlaywrightFactory {
  static browser = null;
  static context = null;
  static page = null;
  static browsers = {};

  /**
   * Initialize browser based on browser type
   */
  static async initializeBrowser(browserType = 'chromium') {
    try {
      Logger.debug(`[Factory] Initializing ${browserType} browser`);

      let playwrightBrowser;
      switch (browserType.toLowerCase()) {
        case 'firefox':
          playwrightBrowser = firefox;
          break;
        case 'webkit':
          playwrightBrowser = webkit;
          break;
        case 'chromium':
        default:
          playwrightBrowser = chromium;
      }

      const browserInstance = await playwrightBrowser.launch({
        headless: Constants.HEADLESS,
        args: [
          '--disable-gpu',
          '--no-sandbox',
          '--disable-dev-shm-usage',
        ],
      });

      this.browser = browserInstance;
      this.browsers[browserType] = browserInstance;
      Logger.info(`[Factory] ${browserType} browser launched successfully`, { browserType });

      return browserInstance;
    } catch (error) {
      Logger.error('[Factory] Failed to initialize browser', error, { browserType });
      throw error;
    }
  }

  /**
   * Create a new browser context with preset configurations
   */
  static async createContext(browser = null, options = {}) {
    try {
      const targetBrowser = browser || this.browser;

      if (!targetBrowser) {
        throw new Error('Browser not initialized. Call initializeBrowser() first');
      }

      const contextOptions = {
        viewport: Constants.VIEWPORT,
        ignoreHTTPSErrors: true,
        ...options,
      };

      Logger.debug('[Factory] Creating browser context', { options: contextOptions });

      const context = await targetBrowser.newContext(contextOptions);

      // Add default navigation handler
      context.on('page', (page) => {
        Logger.debug('[Factory] New page created in context');
      });

      Logger.info('[Factory] Browser context created successfully');

      this.context = context;

      return context;
    } catch (error) {
      Logger.error('[Factory] Failed to create context', error);
      throw error;
    }
  }

  /**
   * Create a new page from context
   */
  static async createPage(context = null) {
    try {
      const targetContext = context || this.context;

      if (!targetContext) {
        throw new Error('Context not initialized. Call createContext() first');
      }

      Logger.debug('[Factory] Creating new page');

      const page = await targetContext.newPage();

      // Set default navigation and action timeouts
      page.setDefaultTimeout(Constants.DEFAULT_TIMEOUT);
      page.setDefaultNavigationTimeout(Constants.NAVIGATION_TIMEOUT);

      // Add event listeners
      page.on('dialog', (dialog) => {
        Logger.warn('[Factory] Dialog detected', { type: dialog.type(), message: dialog.message() });
      });

      page.on('error', (error) => {
        Logger.error('[Factory] Page error', error);
      });

      page.on('load', () => {
        Logger.debug('[Factory] Page loaded');
      });

      Logger.info('[Factory] Page created successfully');

      this.page = page;

      return page;
    } catch (error) {
      Logger.error('[Factory] Failed to create page', error);
      throw error;
    }
  }

  /**
   * Setup test fixture - gets or creates browser, context, and page
   */
  static async setupFixture(browserType = 'chromium') {
    try {
      Logger.info('[Factory] Setting up test fixture', { browserType });

      if (!this.browser) {
        await this.initializeBrowser(browserType);
      }

      if (!this.context) {
        await this.createContext();
      }

      if (!this.page) {
        await this.createPage();
      }

      Logger.info('[Factory] Test fixture setup complete');

      return {
        browser: this.browser,
        context: this.context,
        page: this.page,
      };
    } catch (error) {
      Logger.error('[Factory] Failed to setup fixture', error);
      await this.closeAll();
      throw error;
    }
  }

  /**
   * Cleanup page - closes page but keeps context and browser
   */
  static async closePage() {
    try {
      if (this.page) {
        Logger.debug('[Factory] Closing page');
        await this.page.close();
        this.page = null;
        Logger.info('[Factory] Page closed');
      }
    } catch (error) {
      Logger.error('[Factory] Error closing page', error);
    }
  }

  /**
   * Cleanup context - closes context and all pages
   */
  static async closeContext() {
    try {
      if (this.context) {
        Logger.debug('[Factory] Closing context');
        await this.context.close();
        this.context = null;
        this.page = null;
        Logger.info('[Factory] Context closed');
      }
    } catch (error) {
      Logger.error('[Factory] Error closing context', error);
    }
  }

  /**
   * Cleanup browser - closes everything
   */
  static async closeBrowser() {
    try {
      if (this.browser) {
        Logger.debug('[Factory] Closing browser');
        await this.browser.close();
        this.browser = null;
        this.context = null;
        this.page = null;
        Logger.info('[Factory] Browser closed');
      }
    } catch (error) {
      Logger.error('[Factory] Error closing browser', error);
    }
  }

  /**
   * Teardown - close all resources
   */
  static async closeAll() {
    try {
      Logger.info('[Factory] Tearing down all resources');

      // Close all pages in context
      if (this.context) {
        const pages = this.context.pages();
        for (const page of pages) {
          await page.close().catch((e) => Logger.warn('[Factory] Error closing page', { error: e.message }));
        }
      }

      // Close context
      await this.closeContext();

      // Close all browsers
      for (const [browserType, browser] of Object.entries(this.browsers)) {
        try {
          Logger.debug(`[Factory] Closing ${browserType} browser`);
          await browser.close();
        } catch (error) {
          Logger.warn(`[Factory] Error closing ${browserType} browser`, { error: error.message });
        }
      }

      this.browser = null;
      this.browsers = {};

      Logger.info('[Factory] All resources cleaned up');
    } catch (error) {
      Logger.error('[Factory] Error during teardown', error);
    }
  }

  /**
   * Get current page instance
   */
  static getPage() {
    if (!this.page) {
      throw new Error('Page not initialized. Call setupFixture() first');
    }
    return this.page;
  }

  /**
   * Get current context instance
   */
  static getContext() {
    if (!this.context) {
      throw new Error('Context not initialized. Call setupFixture() first');
    }
    return this.context;
  }

  /**
   * Get current browser instance
   */
  static getBrowser() {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call setupFixture() first');
    }
    return this.browser;
  }

  /**
   * Reset current instances
   */
  static reset() {
    this.browser = null;
    this.context = null;
    this.page = null;
    Logger.debug('[Factory] Factory reset');
  }
}

module.exports = PlaywrightFactory;
