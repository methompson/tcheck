import {
  isBigInt,
  isBoolean,
  isNonEmptyString,
  isNull,
  isNullOrUndefined,
  isNumber,
  isString,
  isSymbol,
  isUndefined,
} from '@/typeguards/primitives';

describe('primitives', () => {
  describe('isString', () => {
    test('should return true if the input is a string', () => {
      expect(isString('')).toBe(true);
      expect(isString('a')).toBe(true);
      expect(isString('abc')).toBe(true);
    });

    test('should return false if the input is not a string', () => {
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
      expect(isString(1)).toBe(false);
      expect(isString(true)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
    });
  });

  describe('isNonEmptyString / isStringWithLength', () => {
    test('should return true if the input is a non-empty string', () => {
      expect(isNonEmptyString('a')).toBe(true);
      expect(isNonEmptyString('abc')).toBe(true);
    });

    test('should return false for empty strings', () => {
      expect(isNonEmptyString('')).toBe(false);
    });

    test('should return false if the input is not a string', () => {
      expect(isNonEmptyString({})).toBe(false);
      expect(isNonEmptyString([])).toBe(false);
      expect(isNonEmptyString(1)).toBe(false);
      expect(isNonEmptyString(true)).toBe(false);
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(undefined)).toBe(false);
    });
  });

  describe('isNumber', () => {
    test('should return true if the input is a number', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(1)).toBe(true);
      expect(isNumber(-1)).toBe(true);
      expect(isNumber(1.5)).toBe(true);
    });

    test('returns true for numeric constants', () => {
      expect(isNumber(Number.MAX_VALUE)).toBe(true);
      expect(isNumber(Number.MIN_VALUE)).toBe(true);
      expect(isNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
      expect(isNumber(Number.MIN_SAFE_INTEGER)).toBe(true);
      expect(isNumber(Number.NaN)).toBe(true);
      expect(isNumber(Number.NEGATIVE_INFINITY)).toBe(true);
      expect(isNumber(Number.POSITIVE_INFINITY)).toBe(true);
    });

    test('should return false if the input is not a number', () => {
      expect(isNumber({})).toBe(false);
      expect(isNumber([])).toBe(false);
      expect(isNumber('')).toBe(false);
      expect(isNumber(true)).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
    });
  });

  describe('isBoolean', () => {
    test('should return true if the input is a boolean', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    test('should return false if the input is not a boolean', () => {
      expect(isBoolean({})).toBe(false);
      expect(isBoolean([])).toBe(false);
      expect(isBoolean('')).toBe(false);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
    });
  });

  describe('isUndefined', () => {
    test('should return true if the input is undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    test('should return false for null', () => {
      expect(isUndefined(null)).toBe(false);
    });

    test('should return false if the input is not undefined', () => {
      expect(isUndefined({})).toBe(false);
      expect(isUndefined([])).toBe(false);
      expect(isUndefined('')).toBe(false);
      expect(isUndefined(1)).toBe(false);
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(true)).toBe(false);
    });
  });

  describe('isNull', () => {
    test('should return true if the input is null', () => {
      expect(isNull(null)).toBe(true);
    });

    test('should return false for undefined', () => {
      expect(isNull(undefined)).toBe(false);
    });

    test('should return false if the input is not null', () => {
      expect(isNull({})).toBe(false);
      expect(isNull([])).toBe(false);
      expect(isNull('')).toBe(false);
      expect(isNull(1)).toBe(false);
      expect(isNull(true)).toBe(false);
    });
  });

  describe('isNullOrUndefined', () => {
    test('should return true if the input is null or undefined', () => {
      expect(isNullOrUndefined(null)).toBe(true);
      expect(isNullOrUndefined(undefined)).toBe(true);
    });

    test('should return false if the input is not null or undefined', () => {
      expect(isNullOrUndefined({})).toBe(false);
      expect(isNullOrUndefined([])).toBe(false);
      expect(isNullOrUndefined('')).toBe(false);
      expect(isNullOrUndefined(1)).toBe(false);
      expect(isNullOrUndefined(true)).toBe(false);
    });
  });

  describe('isBigInt', () => {
    test('should return true if the input is a BigInt', () => {
      expect(isBigInt(BigInt(0))).toBe(true);
      expect(isBigInt(BigInt(1))).toBe(true);
      expect(isBigInt(BigInt(-1))).toBe(true);
      expect(isBigInt(BigInt(Number.MAX_SAFE_INTEGER))).toBe(true);
      expect(isBigInt(BigInt(Number.MIN_SAFE_INTEGER))).toBe(true);
    });

    test('should return false if the input is not a BigInt', () => {
      expect(isBigInt({})).toBe(false);
      expect(isBigInt([])).toBe(false);
      expect(isBigInt('')).toBe(false);
      expect(isBigInt(1)).toBe(false);
      expect(isBigInt(true)).toBe(false);
      expect(isBigInt(null)).toBe(false);
      expect(isBigInt(undefined)).toBe(false);
    });
  });

  describe('isSymbol', () => {
    test('should return true if the input is a symbol', () => {
      expect(isSymbol(Symbol())).toBe(true);
      expect(isSymbol(Symbol('a'))).toBe(true);
    });

    test('should return false if the input is not a symbol', () => {
      expect(isSymbol({})).toBe(false);
      expect(isSymbol([])).toBe(false);
      expect(isSymbol('')).toBe(false);
      expect(isSymbol(1)).toBe(false);
      expect(isSymbol(true)).toBe(false);
      expect(isSymbol(null)).toBe(false);
      expect(isSymbol(undefined)).toBe(false);
    });
  });
});
