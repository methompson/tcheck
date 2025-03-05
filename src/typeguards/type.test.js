import { TypeGuard } from './type';
import { typeGuardGenerator } from '../generators/typeGuardGenerator';
import { isNumber, isString } from './primitives';

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

    expect(true).toBe(true);
  });
});
