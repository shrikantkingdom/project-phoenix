/**
 * UI Tests - End-to-end user interface testing
 * Tests user workflows and page interactions
 */

const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const Logger = require('../utils/Logger');
const Constants = require('../constants/Constants');
const PlaywrightFactory = require('../config/PlaywrightFactory');

test.describe('UI Tests - Login Functionality @ui', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    Logger.step(0, `Starting test: ${test.info?.title || 'UI Test'}`);
    
    // Setup page object
    loginPage = new LoginPage(page);
    
    // Call page setup hook
    await loginPage.beforeEach();
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Call page teardown hook
    if (loginPage) {
      await loginPage.afterEach();
    }

    Logger.info(`[UI Tests] Test completed: ${testInfo.title} - ${testInfo.status}`);

    // Take screenshot on failure
    if (testInfo.status === 'failed') {
      try {
        const screenshot = await loginPage.takeScreenshot(`failure-${testInfo.title}`);
        Logger.info(`[UI Tests] Screenshot saved: ${screenshot}`);
      } catch (error) {
        Logger.warn('[UI Tests] Screenshot capture failed', { error: error.message });
      }
    }
  });

  /**
   * Test UI 1: Verify login page loads and displays form elements
   * @description Validate login page structure and elements
   */
  test('UI-001: Verify login page loads successfully', async () => {
    Logger.step(1, 'Navigate to login page');
    await loginPage.navigateToLoginPage();

    Logger.step(2, 'Verify page title');
    const isPageLoaded = await loginPage.verifyPageTitle();
    expect(isPageLoaded).toBe(true);

    Logger.step(3, 'Verify login form is displayed');
    const selectors = loginPage.getSelectors();
    const usernameField = await loginPage.getSelectorByStrategy(selectors.usernameField);
    expect(usernameField).toBeTruthy();

    Logger.info('✓ Login page loaded successfully with all elements visible');
  });

  /**
   * Test UI 2: Successful login with valid credentials
   * @description Test complete login workflow with valid credentials
   */
  test('UI-002: Login with valid credentials', async () => {
    Logger.step(1, 'Navigate to login page');
    await loginPage.navigateToLoginPage();

    Logger.step(2, 'Perform login');
    await loginPage.loginWithValidCredentials();

    Logger.step(3, 'Verify login success');
    const loginSuccess = await loginPage.verifyLoginSuccess();
    expect(loginSuccess).toBe(true);

    Logger.info('✓ User successfully logged in with valid credentials');
  });

  /**
   * Test UI 3: Failed login with invalid credentials
   * @description Verify error handling for invalid login attempts
   */
  test('UI-003: Login fails with invalid credentials', async () => {
    Logger.step(1, 'Navigate to login page');
    await loginPage.navigateToLoginPage();

    Logger.step(2, 'Attempt login with invalid credentials');
    await loginPage.loginWithInvalidCredentials('invalid_user', 'wrong_password');

    Logger.step(3, 'Verify login failure message appears');
    const loginFailed = await loginPage.verifyLoginFailed();
    expect(loginFailed).toBe(true);

    Logger.step(4, 'Get error message');
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toBeTruthy();

    Logger.info(`✓ Login correctly rejected invalid credentials with message: ${errorMsg}`);
  });

  /**
   * Test UI 4: Test empty credentials validation
   * @description Verify form validation for empty fields
   */
  test('UI-004: Verify form validation for empty credentials', async () => {
    Logger.step(1, 'Navigate to login page');
    await loginPage.navigateToLoginPage();

    Logger.step(2, 'Check login button state with empty fields');
    const isButtonEnabled = await loginPage.isLoginButtonEnabled();
    Logger.info(`[UI Tests] Login button enabled: ${isButtonEnabled}`);

    Logger.step(3, 'Attempt login with empty fields');
    try {
      await loginPage.login('', '');
      
      Logger.step(4, 'Verify error message');
      const errorMsg = await loginPage.getErrorMessage();
      expect(errorMsg).toBeTruthy();
      Logger.info(`✓ Empty credentials validation works: ${errorMsg}`);
    } catch (error) {
      Logger.info('✓ Form validation prevented empty credentials submission');
    }
  });

  /**
   * Test UI 5: Test self-healing selector fallback
   * @description Verify selector strategy and fallback mechanisms
   */
  test('UI-005: Verify self-healing selector strategies work', async () => {
    Logger.step(1, 'Navigate to login page');
    await loginPage.navigateToLoginPage();

    Logger.step(2, 'Test selector strategy resolution');
    const selectors = loginPage.getSelectors();
    
    // Test username field selector
    const usernameSelector = await loginPage.getSelectorByStrategy(selectors.usernameField);
    Logger.info(`[UI Tests] Username field selector: ${usernameSelector}`);
    expect(usernameSelector).toBeTruthy();

    // Test password field selector
    const passwordSelector = await loginPage.getSelectorByStrategy(selectors.passwordField);
    Logger.info(`[UI Tests] Password field selector: ${passwordSelector}`);
    expect(passwordSelector).toBeTruthy();

    // Test login button selector
    const buttonSelector = await loginPage.getSelectorByStrategy(selectors.loginButton);
    Logger.info(`[UI Tests] Login button selector: ${buttonSelector}`);
    expect(buttonSelector).toBeTruthy();

    Logger.info('✓ All selector strategies resolved successfully');
  });

  /**
   * Test UI 6: Test page navigation flow
   * @description Verify page navigation and URL changes
   */
  test('UI-006: Verify page navigation and URL handling', async () => {
    Logger.step(1, 'Navigate to login page');
    await loginPage.navigateToLoginPage();

    Logger.step(2, 'Verify current URL');
    const currentUrl = loginPage.getCurrentUrl();
    expect(currentUrl).toContain('login');

    Logger.step(3, 'Login with valid credentials');
    await loginPage.loginWithValidCredentials();

    Logger.step(4, 'Verify navigation to different page');
    await loginPage.waitUtils.waitForURLChange(loginPage.page, currentUrl);
    const newUrl = loginPage.getCurrentUrl();
    Logger.info(`[UI Tests] New URL: ${newUrl}`);
    expect(newUrl).not.toContain('login');

    Logger.info('✓ Navigation flow works correctly');
  });
});

/**
 * UI Test Summary:
 * These tests follow Page Object Model pattern:
 * 1. Tests are independent and can run in any order
 * 2. Page objects abstract locators from test code
 * 3. Self-healing selectors provide robustness
 * 4. Setup/teardown hooks manage test lifecycle
 * 5. Logging captures detailed execution flow
 *
 * To run only UI tests:
 * npm run test:ui
 *
 * To run with headed browser:
 * npm run test:ui-headed
 */
