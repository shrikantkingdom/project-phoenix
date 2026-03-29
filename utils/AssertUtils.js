/**
 * Assertion Utilities
 * Custom assertion helpers with better error messages and logging
 */

const Logger = require('./Logger');
const { AssertionError } = require('../errors/CustomError');

class AssertUtils {
  /**
   * Assert that value equals expected
   */
  static assertEquals(actual, expected, message = '') {
    if (actual !== expected) {
      Logger.assert(expected, actual, false, { message });
      throw new AssertionError(
        expected,
        actual,
        message || `Expected ${expected} but got ${actual}`
      );
    }
    Logger.assert(expected, actual, true, { message });
  }

  /**
   * Assert that value does not equal expected
   */
  static assertNotEquals(actual, notExpected, message = '') {
    if (actual === notExpected) {
      Logger.assert(`NOT ${notExpected}`, actual, false, { message });
      throw new AssertionError(
        `NOT ${notExpected}`,
        actual,
        message || `Expected NOT ${notExpected} but got ${actual}`
      );
    }
    Logger.assert(`NOT ${notExpected}`, actual, true, { message });
  }

  /**
   * Assert that value is true
   */
  static assertTrue(value, message = '') {
    if (value !== true) {
      Logger.assert(true, value, false, { message });
      throw new AssertionError(true, value, message || `Expected true but got ${value}`);
    }
    Logger.assert(true, value, true, { message });
  }

  /**
   * Assert that value is false
   */
  static assertFalse(value, message = '') {
    if (value !== false) {
      Logger.assert(false, value, false, { message });
      throw new AssertionError(false, value, message || `Expected false but got ${value}`);
    }
    Logger.assert(false, value, true, { message });
  }

  /**
   * Assert that value is null
   */
  static assertNull(value, message = '') {
    if (value !== null) {
      Logger.assert(null, value, false, { message });
      throw new AssertionError(null, value, message || `Expected null but got ${value}`);
    }
    Logger.assert(null, value, true, { message });
  }

  /**
   * Assert that value is not null
   */
  static assertNotNull(value, message = '') {
    if (value === null) {
      Logger.assert('NOT null', value, false, { message });
      throw new AssertionError('NOT null', value, message || `Expected NOT null`);
    }
    Logger.assert('NOT null', value, true, { message });
  }

  /**
   * Assert that value is defined
   */
  static assertDefined(value, message = '') {
    if (value === undefined) {
      Logger.assert('defined', 'undefined', false, { message });
      throw new AssertionError('defined', 'undefined', message || `Expected defined value`);
    }
    Logger.assert('defined', value, true, { message });
  }

  /**
   * Assert that array contains value
   */
  static assertContains(array, value, message = '') {
    if (!array.includes(value)) {
      Logger.assert(`contains ${value}`, array, false, { message });
      throw new AssertionError(
        `Array contains ${value}`,
        `[${array.join(', ')}]`,
        message || `Array does not contain ${value}`
      );
    }
    Logger.assert(`contains ${value}`, array, true, { message });
  }

  /**
   * Assert that string contains substring
   */
  static assertStringContains(str, substring, message = '', caseSensitive = true) {
    const searchStr = caseSensitive ? str : str.toLowerCase();
    const searchSubstring = caseSensitive ? substring : substring.toLowerCase();

    if (!searchStr.includes(searchSubstring)) {
      Logger.assert(`contains "${substring}"`, str, false, { message });
      throw new AssertionError(
        `"${substring}"`,
        `"${str}"`,
        message || `Expected to contain "${substring}"`
      );
    }
    Logger.assert(`contains "${substring}"`, str, true, { message });
  }

  /**
   * Assert that string matches pattern
   */
  static assertMatches(str, pattern, message = '') {
    const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);

    if (!regex.test(str)) {
      Logger.assert(`matches ${pattern}`, str, false, { message });
      throw new AssertionError(
        `matches ${pattern}`,
        str,
        message || `String does not match pattern ${pattern}`
      );
    }
    Logger.assert(`matches ${pattern}`, str, true, { message });
  }

  /**
   * Assert that array length equals expected
   */
  static assertArrayLength(array, expectedLength, message = '') {
    if (array.length !== expectedLength) {
      Logger.assert(`length ${expectedLength}`, array.length, false, { message });
      throw new AssertionError(
        `length ${expectedLength}`,
        array.length,
        message || `Expected array length ${expectedLength} but got ${array.length}`
      );
    }
    Logger.assert(`length ${expectedLength}`, array.length, true, { message });
  }

  /**
   * Assert that object contains key
   */
  static assertObjectHasKey(obj, key, message = '') {
    if (!(key in obj)) {
      Logger.assert(`has key "${key}"`, Object.keys(obj), false, { message });
      throw new AssertionError(
        `object has key "${key}"`,
        `available keys: ${Object.keys(obj).join(', ')}`,
        message || `Object does not have key "${key}"`
      );
    }
    Logger.assert(`has key "${key}"`, Object.keys(obj), true, { message });
  }

  /**
   * Assert that value is greater than
   */
  static assertGreaterThan(actual, expected, message = '') {
    if (!(actual > expected)) {
      Logger.assert(`> ${expected}`, actual, false, { message });
      throw new AssertionError(
        `> ${expected}`,
        actual,
        message || `Expected ${actual} to be greater than ${expected}`
      );
    }
    Logger.assert(`> ${expected}`, actual, true, { message });
  }

  /**
   * Assert that value is greater than or equal to
   */
  static assertGreaterThanOrEqual(actual, expected, message = '') {
    if (!(actual >= expected)) {
      Logger.assert(`>= ${expected}`, actual, false, { message });
      throw new AssertionError(
        `>= ${expected}`,
        actual,
        message || `Expected ${actual} to be >= ${expected}`
      );
    }
    Logger.assert(`>= ${expected}`, actual, true, { message });
  }

  /**
   * Assert that value is less than
   */
  static assertLessThan(actual, expected, message = '') {
    if (!(actual < expected)) {
      Logger.assert(`< ${expected}`, actual, false, { message });
      throw new AssertionError(
        `< ${expected}`,
        actual,
        message || `Expected ${actual} to be less than ${expected}`
      );
    }
    Logger.assert(`< ${expected}`, actual, true, { message });
  }

  /**
   * Assert that value is less than or equal to
   */
  static assertLessThanOrEqual(actual, expected, message = '') {
    if (!(actual <= expected)) {
      Logger.assert(`<= ${expected}`, actual, false, { message });
      throw new AssertionError(
        `<= ${expected}`,
        actual,
        message || `Expected ${actual} to be <= ${expected}`
      );
    }
    Logger.assert(`<= ${expected}`, actual, true, { message });
  }

  /**
   * Assert that array is empty
   */
  static assertEmpty(arr, message = '') {
    if (arr.length !== 0) {
      Logger.assert('empty', `${arr.length} items`, false, { message });
      throw new AssertionError(
        'empty array',
        `array with ${arr.length} items`,
        message || `Expected array to be empty`
      );
    }
    Logger.assert('empty', 'empty', true, { message });
  }

  /**
   * Assert that array is not empty
   */
  static assertNotEmpty(arr, message = '') {
    if (arr.length === 0) {
      Logger.assert('not empty', 'empty', false, { message });
      throw new AssertionError(
        'not empty array',
        'empty array',
        message || `Expected array to not be empty`
      );
    }
    Logger.assert('not empty', `${arr.length} items`, true, { message });
  }

  /**
   * Fail with custom message
   */
  static fail(message = 'Assertion failed') {
    Logger.error(`Test assertion failure: ${message}`);
    throw new AssertionError('success', 'failure', message);
  }

  /**
   * Skip test with optional message
   */
  static skip(message = 'Test skipped') {
    Logger.info(`Test skipped: ${message}`);
    // This will be handled by test framework
    throw new Error(`SKIP: ${message}`);
  }
}

module.exports = AssertUtils;
