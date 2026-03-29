/**
 * API Client - HTTP client for API testing (shift-left approach)
 * Handles API requests with retry logic and error handling
 */

const Logger = require('../utils/Logger');
const Constants = require('../constants/Constants');
const CommonUtils = require('../utils/CommonUtils');
const { APIError } = require('../errors/CustomError');

class APIClient {
  constructor(baseUrl = Constants.API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = Constants.DEFAULT_HEADERS;
    this.timeout = Constants.API_TIMEOUT;
    this.maxRetries = Constants.API_RETRIES;
  }

  /**
   * Make HTTP request
   */
  async request(method, endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    const requestOptions = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      timeout: options.timeout || this.timeout,
      ...options,
    };

    // Remove headers from options to prevent duplication
    delete requestOptions.headers.timeout;

    if (options.body && typeof options.body === 'object') {
      requestOptions.body = JSON.stringify(options.body);
    }

    try {
      Logger.apiCall(method, url, '...', 0);
      Logger.debug(`[APIClient] Sending ${method} request to ${url}`);

      const startTime = new Date();
      const response = await fetch(url, requestOptions);
      const duration = new Date() - startTime;

      const responseBody = await response.text();
      let parsed;
      try {
        parsed = JSON.parse(responseBody);
      } catch {
        parsed = responseBody;
      }

      Logger.apiCall(method, url, response.status, duration, {
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
      });

      if (!response.ok) {
        Logger.error(
          `[APIClient] ${method} ${url} returned ${response.status}`,
          null,
          {
            status: response.status,
            response: parsed,
          }
        );
      }

      return {
        status: response.status,
        statusText: response.statusText,
        headers: this._parseHeaders(response.headers),
        body: parsed,
        text: responseBody,
        ok: response.ok,
      };
    } catch (error) {
      Logger.error(`[APIClient] Request failed: ${method} ${url}`, error);
      throw new APIError(method, url, 0, null, error);
    }
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    try {
      Logger.info(`[APIClient] GET ${endpoint}`);
      return await this.request('GET', endpoint, options);
    } catch (error) {
      Logger.error(`[APIClient] GET failed: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * POST request
   */
  async post(endpoint, body = {}, options = {}) {
    try {
      Logger.info(`[APIClient] POST ${endpoint}`);
      return await this.request('POST', endpoint, {
        body,
        ...options,
      });
    } catch (error) {
      Logger.error(`[APIClient] POST failed: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put(endpoint, body = {}, options = {}) {
    try {
      Logger.info(`[APIClient] PUT ${endpoint}`);
      return await this.request('PUT', endpoint, {
        body,
        ...options,
      });
    } catch (error) {
      Logger.error(`[APIClient] PUT failed: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * PATCH request
   */
  async patch(endpoint, body = {}, options = {}) {
    try {
      Logger.info(`[APIClient] PATCH ${endpoint}`);
      return await this.request('PATCH', endpoint, {
        body,
        ...options,
      });
    } catch (error) {
      Logger.error(`[APIClient] PATCH failed: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    try {
      Logger.info(`[APIClient] DELETE ${endpoint}`);
      return await this.request('DELETE', endpoint, options);
    } catch (error) {
      Logger.error(`[APIClient] DELETE failed: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * Request with retry logic
   */
  async requestWithRetry(method, endpoint, options = {}, retries = this.maxRetries) {
    try {
      return await CommonUtils.retry(
        () => this.request(method, endpoint, options),
        retries
      );
    } catch (error) {
      Logger.error(`[APIClient] Request failed after ${retries} retries: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * Parse response headers as object
   */
  _parseHeaders(headers) {
    const result = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Verify response status
   */
  verifyStatus(response, expectedStatus) {
    if (response.status !== expectedStatus) {
      throw new APIError(
        'request',
        'unknown',
        response.status,
        response.body,
        new Error(`Expected status ${expectedStatus} but got ${response.status}`)
      );
    }
    Logger.info(`[APIClient] Status verification passed: ${response.status}`);
    return true;
  }

  /**
   * Verify response body contains key
   */
  verifyResponseHasKey(response, key) {
    if (!response.body || !(key in response.body)) {
      throw new Error(`Response does not contain key: ${key}`);
    }
    Logger.info(`[APIClient] Response contains key: ${key}`);
    return true;
  }

  /**
   * Verify response body value
   */
  verifyResponseValue(response, key, expectedValue) {
    const actualValue = this._getNestedValue(response.body, key);
    if (actualValue !== expectedValue) {
      throw new Error(`Expected ${key}=${expectedValue} but got ${actualValue}`);
    }
    Logger.info(`[APIClient] Response value verified: ${key}=${expectedValue}`);
    return true;
  }

  /**
   * Get nested value from object
   */
  _getNestedValue(obj, path) {
    return CommonUtils.getNestedValue(obj, path);
  }

  /**
   * Test API endpoint with full validation
   */
  async testEndpoint(method, endpoint, body = null, expectedStatus = 200) {
    try {
      Logger.step(1, `Test ${method} ${endpoint}`);

      const options = body ? { body } : {};
      const response = await this.request(method, endpoint, options);

      Logger.step(2, 'Verify response status');
      this.verifyStatus(response, expectedStatus);

      Logger.step(3, 'Verify response body');
      if (response.body && typeof response.body === 'object') {
        Logger.debug('[APIClient] Response body valid JSON');
      }

      Logger.step(4, 'Verify response headers');
      if (response.headers['content-type']) {
        Logger.debug(`[APIClient] Content-Type: ${response.headers['content-type']}`);
      }

      return response;
    } catch (error) {
      Logger.error(`[APIClient] API test failed: ${method} ${endpoint}`, error);
      throw error;
    }
  }
}

module.exports = APIClient;
