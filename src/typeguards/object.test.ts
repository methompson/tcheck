import { isFunction, isInstanceOf, isStrictFunction } from './object';

describe('object checking', () => {
  describe('isRecord', () => {});

  describe('isArray', () => {});

  describe('isFunction', () => {
    test('should return true if the input is a function', () => {
      const closure = () => {};
      const regFunc = function test() {};

      expect(isFunction(closure)).toBe(true);
      expect(isFunction(regFunc)).toBe(true);
    });

    test('returns true for ES5-style classes', () => {
      function myClass() {}
      myClass.prototype.myMethod = function myMethod() {};

      expect(isFunction(myClass)).toBe(true);
    });

    test('returns true for ES6-style classes', () => {
      class myClass {
        myMethod() {}
      }

      expect(isFunction(myClass)).toBe(true);
    });

    test('should return false if the input is not a function', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction([])).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
      expect(isFunction(1)).toBe(false);
      expect(isFunction('')).toBe(false);
      expect(isFunction(true)).toBe(false);
    });
  });

  describe('isStrictFunction', () => {
    test('should return true if the input is a function', () => {
      const closure = () => {};
      const regFunc = function test() {};

      expect(isStrictFunction(closure)).toBe(true);
      expect(isStrictFunction(regFunc)).toBe(true);
    });

    test('returns false for ES5-style classes', () => {
      function myClass() {}
      myClass.prototype.myMethod = function myMethod() {};

      expect(isStrictFunction(myClass)).toBe(false);
    });

    test('returns false for ES5-style classes with static methods', () => {
      function myClass() {}
      myClass.myMethod = function myMethod() {};

      expect(isStrictFunction(myClass)).toBe(false);
    });

    test('returns false for ES5-style classes with static values', () => {
      function myClass() {}
      myClass.myValue = 1;

      expect(isStrictFunction(myClass)).toBe(false);
    });

    test('returns false for ES6-style classes', () => {
      class myClass {
        myMethod() {}
      }

      expect(isStrictFunction(myClass)).toBe(false);
    });

    test('returns false for ES6-style classes with static methods', () => {
      class myClass {
        static myMethod() {}
      }

      expect(isStrictFunction(myClass)).toBe(false);
    });

    test('returns false for ES6-style classes with static values', () => {
      class myClass {
        static myValue = 1;
      }

      expect(isStrictFunction(myClass)).toBe(false);
    });

    test('should return false if the input is not a function', () => {
      expect(isStrictFunction({})).toBe(false);
      expect(isStrictFunction([])).toBe(false);
      expect(isStrictFunction(null)).toBe(false);
      expect(isStrictFunction(undefined)).toBe(false);
      expect(isStrictFunction(1)).toBe(false);
      expect(isStrictFunction('')).toBe(false);
      expect(isStrictFunction(true)).toBe(false);
    });
  });

  describe('isInstanceOf', () => {
    test('should return true if input is a instance of a class', () => {
      const t = new Date();

      expect(isInstanceOf<Date>(t, Date)).toBe(true);
    });

    test('should return false if input is not an instance of a class', () => {
      const t = new Date();

      expect(isInstanceOf<Uint16Array>(t, Uint16Array)).toBe(false);
    });
  });
});
