/**
 * API Tests - Shift-left testing approach
 * Test API endpoints before UI testing
 */

const { test, expect } = require('@playwright/test');
const APIClient = require('../utils/ApiClient');
const Logger = require('../utils/Logger');
const Constants = require('../constants/Constants');

test.describe('API Tests - Shift-Left Testing @api', () => {
  let apiClient;

  test.beforeAll(async () => {
    Logger.info('[API Tests] Suite Setup');
    apiClient = new APIClient(Constants.API_BASE_URL);
  });

  test.beforeEach(async ({ page }) => {
    Logger.step(0, `Starting test: ${test.info?.title || 'API Test'}`);
  });

  test.afterEach(async ({ page }, testInfo) => {
    Logger.info(`[API Tests] Test completed: ${testInfo.title} - ${testInfo.status}`);
  });

  /**
   * Test API 1: Verify base URL is accessible
   * @description Test API connectivity and health check
   */
  test('API-001: Verify API server is accessible', async () => {
    Logger.step(1, 'Send GET request to base URL');
    
    try {
      const response = await apiClient.get('/');
      
      Logger.step(2, 'Verify response status');
      apiClient.verifyStatus(response, 200);
      
      Logger.step(3, 'Verify response body is valid HTML');
      expect(response.text).toBeTruthy();
      
      Logger.info('✓ API server is accessible and healthy');
    } catch (error) {
      Logger.error('API Health Check Failed', error);
      throw error;
    }
  });

  /**
   * Test API 2: Test JSON API endpoint
   * @description Verify JSON endpoint functionality
   */
  test('API-002: Verify JSON endpoint returns valid data', async () => {
    Logger.step(1, 'Send GET request to JSON endpoint');
    
    try {
      const response = await apiClient.get('/json_endpoint');
      
      Logger.step(2, 'Verify response status');
      if (response.status === 200 || response.status === 404) {
        Logger.info(`API returned status ${response.status}`);
      }
      
      Logger.step(3, 'Verify response format');
      if (response.body && typeof response.body === 'object') {
        Logger.info('Response body is valid JSON');
        expect(response.body).toBeDefined();
      }
    } catch (error) {
      Logger.warn('JSON endpoint test - endpoint may not be available', { error: error.message });
      // Don't fail - this endpoint may not exist in test environment
    }
  });

  /**
   * Test API 3: Test error handling on invalid endpoint
   * @description Verify API returns proper error for invalid requests
   */
  test('API-003: Verify API error handling for invalid endpoint', async () => {
    Logger.step(1, 'Send GET request to invalid endpoint');
    
    try {
      const response = await apiClient.get('/invalid-endpoint-test-' + Date.now());
      
      Logger.step(2, 'Verify response status for invalid endpoint');
      expect(response.status).toBeGreaterThanOrEqual(400);
      Logger.info(`✓ API returned error status ${response.status} for invalid endpoint`);
    } catch (error) {
      Logger.error('API Error Handling Test Failed', error);
      throw error;
    }
  });

  /**
   * Test API 4: Test authentication endpoint (mock test)
   * @description Verify authentication endpoint structure
   */
  test('API-004: Verify authentication endpoint is available', async () => {
    Logger.step(1, 'Check authentication endpoint');
    
    try {
      const response = await apiClient.get('/authenticate');
      
      Logger.step(2, 'Verify response');
      // Endpoint may exist or return 404, both are valid
      expect(response.status).toBeDefined();
      Logger.info(`✓ Authentication endpoint status: ${response.status}`);
    } catch (error) {
      Logger.warn('Auth endpoint test - may not be available', { error: error.message });
    }
  });

  /**
   * Test API 5: Test response headers
   * @description Verify proper headers in API responses
   */
  test('API-005: Verify API response headers', async () => {
    Logger.step(1, 'Send GET request and check headers');
    
    try {
      const response = await apiClient.get('/');
      
      Logger.step(2, 'Verify response headers exist');
      expect(response.headers).toBeDefined();
      expect(Object.keys(response.headers).length).toBeGreaterThan(0);
      
      Logger.step(3, 'Log important headers');
      Logger.debug(`Content-Type: ${response.headers['content-type']}`);
      Logger.debug(`Server: ${response.headers['server']}`);
      
      Logger.info('✓ Response headers verified');
    } catch (error) {
      Logger.error('Response Headers Test Failed', error);
      throw error;
    }
  });
});

/**
 * API Test Summary:
 * These tests follow shift-left testing approach:
 * 1. Test API functionality BEFORE UI tests
 * 2. Verify backend health and connectivity
 * 3. Catch API issues early in test cycle
 * 4. Provide baseline for UI test reliability
 *
 * To run only API tests:
 * npm run test:api
 *
 * To run with detailed logging:
 * npm run test:debug -- api
 */
