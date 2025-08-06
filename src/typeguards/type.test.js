import { typeGuardGenerator } from '../generators/typeGuardGenerator';
import { isNumber, isString } from './primitives';

/**
 * @typedef {import('../utils/type').TypeGuard<T>} TypeGuard
 * @template T
 */

/**
 * @typedef {object} TestType
 * @property {string} key
 * @property {number} value
 */

describe('types', () => {
  test('Checking linting', () => {
    /** @type {TypeGuard<TestType>} */
    const tg = typeGuardGenerator({
      key: isString,
      value: isNumber,
    });

    const value = {
      key: 'key',
      value: 1,
    };

    expect(tg(value)).toBe(true);
  });

  test('Checking more linting', () => {
    /** @type {import('../utils/type').TypeGuard<TestType>} */
    const tg = typeGuardGenerator({
      key: isString,
      value: isNumber,
    });

    const value = {
      key: 'key',
      value: 1,
    };

    expect(tg(value)).toBe(true);
  });
});
