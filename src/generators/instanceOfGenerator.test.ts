import {
  isArrayOfGenerator,
  isInstanceOfGenerator,
} from './instanceOfGenerator';
import { isString } from '../typeguards/primitives';

describe('instanceOfGenerator', () => {
  describe('isInstanceOfGenerator', () => {
    test('generates a type checker for a built-in type that works as intended', () => {
      const isDate = isInstanceOfGenerator<Date>(Date);

      expect(typeof isDate).toBe('function');

      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date().toISOString())).toBe(false);
    });

    test('creates a generator for a user created class that works as intended', () => {
      class TestClass {
        constructor(public a: number) {}
      }

      const isTestClass = isInstanceOfGenerator<TestClass>(TestClass);

      expect(isTestClass(new TestClass(1))).toBe(true);
      expect(isTestClass({ a: 1 })).toBe(false);
    });

    test('returns false for an object that is similar to a regular object', () => {
      class TestClass {
        a = 'a';
        b() {
          return 'b';
        }
      }
      const fakeInst = {
        a: 'a',
        b: () => 'b',
      };

      const isTestClass = isInstanceOfGenerator<TestClass>(TestClass);

      expect(isTestClass(new TestClass())).toBe(true);
      expect(isTestClass(fakeInst)).toBe(false);
    });
  });

  describe('isArrayOfGenerator', () => {
    test('generates a type checker for an array of built-in types that works as intended', () => {
      const isStrArr = isArrayOfGenerator<string>(isString);

      expect(isStrArr(['a', 'b', 'c'])).toBe(true);
      expect(isStrArr(['a', 'b', 1])).toBe(false);
    });

    test('creates a generator for an array of a user created class that works as intended', () => {
      class TestClass {
        constructor(public a: number) {}
      }

      const isTestClass = isInstanceOfGenerator<TestClass>(TestClass);
      const isTCArr = isArrayOfGenerator<TestClass>(isTestClass);

      expect(isTCArr([new TestClass(1), new TestClass(2)])).toBe(true);
      expect(isTCArr([{ a: 1 }, { a: 2 }])).toBe(false);
    });

    test('returns false for an array of objects that are similar to regular objects', () => {
      class TestClass {
        a = 'a';
        b() {
          return 'b';
        }
      }
      const fakeInst = {
        a: 'a',
        b: () => 'b',
      };

      const isTestClass = isInstanceOfGenerator<TestClass>(TestClass);
      const isTCArr = isArrayOfGenerator<TestClass>(isTestClass);

      expect(isTCArr([new TestClass(), new TestClass()])).toBe(true);
      expect(isTCArr([fakeInst])).toBe(false);
    });
  });
});
