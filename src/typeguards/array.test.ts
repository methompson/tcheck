import { isArrayOf, isArray } from '@/typeguards/array';
import { isNumber, isString } from '@/typeguards/primitives';

describe('arrays', () => {
  describe('isArray', () => {
    test('returns true for arrays with any values', () => {
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(['a', new Date(), null, {}])).toBe(true);
    });

    test('returns true for empty arrays', () => {
      expect(isArray([])).toBe(true);
    });

    test('returns false for other values', () => {
      expect(isArray(1)).toBe(false);
      expect(isArray('a')).toBe(false);
      expect(isArray({})).toBe(false);
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
      expect(isArray(true)).toBe(false);
      expect(isArray(() => {})).toBe(false);
      expect(isArray(function test() {})).toBe(false);
    });
  });

  describe('arrayOf', () => {
    test('returns true for arrays with values that pass the guard', () => {
      const numArr: unknown[] = Array.from(
        { length: 100 },
        (_value, index) => index,
      );
      const strArr: unknown[] = numArr.map((i) => `${i}`);

      expect(isArrayOf<number>(numArr, isNumber)).toBe(true);
      expect(isArrayOf<string>(strArr, isString)).toBe(true);
    });

    test('returns false for arrays with values that do not match the guard', () => {
      const numArr: unknown[] = Array.from(
        { length: 100 },
        (_value, index) => index,
      );
      const strArr: unknown[] = numArr.map((i) => `${i}`);

      numArr.push('a');
      strArr.push(1);

      expect(isArrayOf<string>(numArr, isString)).toBe(false);
      expect(isArrayOf<number>(strArr, isNumber)).toBe(false);
    });
  });
});
