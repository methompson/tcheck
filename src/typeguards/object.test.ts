import {
  isFunction,
  isInstanceOf,
  isObject,
  isRecord,
  isStrictFunction,
} from './object';

describe('object checking', () => {
  describe('isRecord', () => {
    test('returns true for regular objects', () => {
      expect(isRecord({})).toBe(true);
      expect(isRecord({ a: 1 })).toBe(true);
    });

    test('returns true for instances from classes', () => {
      expect(isRecord(new Date())).toBe(true);
      expect(isRecord(new RegExp('a'))).toBe(true);
    });

    test('returns false for arrays', () => {
      expect(isRecord([])).toBe(false);
      expect(isRecord([1, 2, 3])).toBe(false);
    });

    test('returns false for functions', () => {
      expect(isRecord(() => {})).toBe(false);
      expect(isRecord(function test() {})).toBe(false);
    });

    test('returns false for non-objects', () => {
      expect(isRecord(null)).toBe(false);
      expect(isRecord(undefined)).toBe(false);
      expect(isRecord(1)).toBe(false);
      expect(isRecord('')).toBe(false);
      expect(isRecord(true)).toBe(false);
    });
  });

  describe('isObject', () => {
    test('returns true for regular objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
    });

    test('returns true for instances from classes', () => {
      expect(isObject(new Date())).toBe(true);
      expect(isObject(new RegExp('a'))).toBe(true);
    });

    test('returns false for arrays', () => {
      expect(isObject([])).toBe(false);
      expect(isObject([1, 2, 3])).toBe(false);
    });

    test('returns false for functions', () => {
      expect(isObject(() => {})).toBe(false);
      expect(isObject(function test() {})).toBe(false);
    });

    test('returns false for non-objects', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject(1)).toBe(false);
      expect(isObject('')).toBe(false);
      expect(isObject(true)).toBe(false);
    });
  });

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
    test('should return true if input is a instance of a built-in class', () => {
      const t = new Date();
      expect(isInstanceOf<Date>(t, Date)).toBe(true);

      const b = new Uint8Array(1);
      expect(isInstanceOf<Uint8Array>(b, Uint8Array)).toBe(true);
    });

    test('should return false if input is not an instance of a built-in class', () => {
      const t = new Date();

      expect(isInstanceOf<Uint16Array>(t, Uint16Array)).toBe(false);
    });

    test('should return true if the input is an instance of a user-created class', () => {
      class AClass {}

      const a = new AClass();

      expect(isInstanceOf<AClass>(a, AClass)).toBe(true);
    });

    test('should return true if the input is an instance of a user-created class with a constructor', () => {
      class AClass {
        constructor(public a: number) {}
      }

      const a = new AClass(1);

      expect(isInstanceOf<AClass>(a, AClass)).toBe(true);
    });

    test('should return false if the input is not an instance of a user-created class', () => {
      class AClass {
        constructor(public a: number) {}
      }

      expect(isInstanceOf<AClass>(1, AClass)).toBe(false);
    });

    test('should return false if the input is a regular object with the same values, but not an instance of the class', () => {
      class AClass {
        constructor(public a: number) {}
      }

      const aObj = {
        a: 1,
      };

      expect(isInstanceOf<AClass>(aObj, AClass)).toBe(false);
    });
  });
});
