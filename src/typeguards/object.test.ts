import { isArrayOfGenerator } from '@/generators/instanceOfGenerator';
import { typeGuardGenerator } from '@/generators/typeGuardGenerator';
import { unionGuard } from '@/generators/union';
import {
  isFunction,
  isObjectOf,
  isInstanceOf,
  isInterfaceOf,
  isInterfaceOfStrict,
  isObject,
  isRecord,
} from '@/typeguards/object';
import {
  isBoolean,
  isNumber,
  isString,
  isUndefined,
} from '@/typeguards/primitives';

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
      expect(isRecord(Date)).toBe(false);
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

    test('Should return true for built-in classes', () => {
      expect(isFunction(Date)).toBe(true);
      expect(isFunction(Number)).toBe(true);
      expect(isFunction(BigInt)).toBe(true);
      expect(isFunction(String)).toBe(true);

      expect(isFunction(Array)).toBe(true);
      expect(isFunction(Int8Array)).toBe(true);
      expect(isFunction(Uint8Array)).toBe(true);
      expect(isFunction(Uint8ClampedArray)).toBe(true);
      expect(isFunction(Int16Array)).toBe(true);
      expect(isFunction(Uint16Array)).toBe(true);
      expect(isFunction(Int32Array)).toBe(true);
      expect(isFunction(Uint32Array)).toBe(true);
      expect(isFunction(BigInt64Array)).toBe(true);
      expect(isFunction(BigUint64Array)).toBe(true);
      expect(isFunction(Float32Array)).toBe(true);
      expect(isFunction(Float64Array)).toBe(true);
      expect(isFunction(Map)).toBe(true);
      expect(isFunction(Set)).toBe(true);
      expect(isFunction(WeakMap)).toBe(true);
      expect(isFunction(WeakSet)).toBe(true);
      expect(isFunction(ArrayBuffer)).toBe(true);
      expect(isFunction(SharedArrayBuffer)).toBe(true);
      expect(isFunction(DataView)).toBe(true);
      expect(isFunction(Promise)).toBe(true);
      expect(isFunction(Proxy)).toBe(true);
    });

    test('returns true for ES5-style classes', () => {
      function myClass() {}
      myClass.prototype.myMethod = function myMethod() {};

      expect(isFunction(myClass)).toBe(true);
    });

    test('returns false for ES6-style classes', () => {
      class myClass {
        myMethod() {}
      }

      expect(isFunction(myClass)).toBe(false);
    });

    test('should return false if the input is not a function', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction([])).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
      expect(isFunction(1)).toBe(false);
      expect(isFunction('')).toBe(false);
      expect(isFunction(true)).toBe(false);
      expect(isFunction(BigInt(1))).toBe(false);
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

    test('should return true if the input is an ES5 class', () => {
      interface AClassInterface {
        a(): void;
      }
      interface AClassConstructor {
        new (...args: never[]): AClassInterface;
      }
      const AClass = function (
        this: AClassInterface,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) {} as any as AClassConstructor;
      AClass.prototype.a = function a() {};

      const a = new AClass();

      // This is stupid, but it works. Check the JS version to see it in action for real
      expect(isInstanceOf<AClassInterface>(a, AClass)).toBe(true);
    });

    test('should return true if the input is an instance of a user-created ES6 class', () => {
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

  describe('isInterfaceOf', () => {
    test('returns true for an object that conforms to the interface', () => {
      interface MyFunInterface {
        key: string;
        num: number;
        bool: boolean;
      }
      const input = {
        key: 'hello',
        num: 1,
        bool: true,
      };
      const result = isInterfaceOf<MyFunInterface>(input, {
        key: isString,
        num: isNumber,
        bool: isBoolean,
      });

      expect(result).toBe(true);
    });

    test('The typeguard can be used in a nested interface', () => {
      interface ValueSet {
        value: string;
        isTrue: boolean;
      }

      interface MyFunInterface {
        key: string;
        num: number;
        bool: boolean;
        valueSet: ValueSet;
      }

      const vsCmn = {
        value: isString,
        isTrue: isBoolean,
      };

      const mfiCommon = {
        key: isString,
        num: isNumber,
        bool: isBoolean,
        valueSet: typeGuardGenerator<ValueSet>(vsCmn),
      };

      const trueVal = {
        key: 'key',
        num: 96,
        bool: false,
        valueSet: { value: 'hello', isTrue: true },
      };

      const falseVal = {
        key: 'key',
        num: 96,
        bool: false,
        valueSet: { value: 'hello', isTrue: 'true' },
      };

      const result1 = isInterfaceOf<MyFunInterface>(trueVal, mfiCommon);
      const result2 = isInterfaceOf<MyFunInterface>(falseVal, mfiCommon);

      expect(result1).toBe(true);
      expect(result2).toBe(false);
    });

    test('returns false for an object that deviates from the interface', () => {
      interface MyFunInterface {
        key: string;
        num: number;
        bool: boolean;
      }

      const input = {
        key: 'hello',
        num: 1,
        bool: 'true',
      };

      const result = isInterfaceOf<MyFunInterface>(input, {
        key: isString,
        num: isNumber,
        bool: isBoolean,
      });

      expect(result).toBe(false);
    });

    test('examples', () => {
      interface Fun {
        a: string;
        b: number;
        c: boolean;
      }

      const goodInput = {
        a: 'a',
        b: 1,
        c: true,
      };

      const badInput = {
        a: 'a',
        b: 1,
        c: true,
        d: 'extra',
      };

      expect(
        isInterfaceOfStrict<Fun>(goodInput, {
          a: isString,
          b: isNumber,
          c: isBoolean,
        }),
      ).toBe(true); // resolves to true
      expect(
        isInterfaceOfStrict<Fun>(badInput, {
          a: isString,
          b: isNumber,
          c: isBoolean,
        }),
      ).toBe(false); // resolves to false
    });
  });

  describe('isInterfaceOfStrict', () => {
    test('returns true for an object that conforms to the interface', () => {
      interface MyFunInterface {
        key: string;
        num: number;
        bool: boolean;
      }
      const input = {
        key: 'hello',
        num: 1,
        bool: true,
      };
      const result = isInterfaceOfStrict<MyFunInterface>(input, {
        key: isString,
        num: isNumber,
        bool: isBoolean,
      });

      expect(result).toBe(true);
    });

    test('returns false for an object that deviates from the interface', () => {
      interface MyFunInterface {
        key: string;
        num: number;
        bool: boolean;
      }

      const input = {
        key: 'hello',
        num: 1,
        bool: 'true',
      };

      const result = isInterfaceOfStrict<MyFunInterface>(input, {
        key: isString,
        num: isNumber,
        bool: isBoolean,
      });

      expect(result).toBe(false);
    });

    test('returns false for an object that has extra keys', () => {
      interface MyFunInterface {
        key: string;
        num: number;
        bool: boolean;
      }

      const input = {
        key: 'hello',
        num: 1,
        bool: true,
        extra: 'extra',
      };

      const result = isInterfaceOfStrict<MyFunInterface>(input, {
        key: isString,
        num: isNumber,
        bool: isBoolean,
      });

      expect(result).toBe(false);
    });

    test('returns false for an object that is missing keys', () => {
      interface MyFunInterface {
        key: string;
        num: number;
        bool: boolean;
      }

      const input = {
        key: 'hello',
        num: 1,
      };

      const result = isInterfaceOfStrict<MyFunInterface>(input, {
        key: isString,
        num: isNumber,
        bool: isBoolean,
      });

      expect(result).toBe(false);
    });

    test('examples', () => {
      interface Fun {
        a: string;
        b: number;
        c: boolean;
      }

      const goodInput = {
        a: 'a',
        b: 1,
        c: true,
      };

      const badInput = {
        a: 'a',
        b: 1,
        c: true,
        d: 'extra',
      };

      expect(
        isInterfaceOfStrict<Fun>(goodInput, {
          a: isString,
          b: isNumber,
          c: isBoolean,
        }),
      ).toBe(true); // resolves to true
      expect(
        isInterfaceOfStrict<Fun>(badInput, {
          a: isString,
          b: isNumber,
          c: isBoolean,
        }),
      ).toBe(false); // resolves to false
    });
  });

  describe('isObjectOf', () => {
    test('returns true for an object of primitives', () => {
      const input = {
        a: 'a',
        b: 'b',
        c: 'c',
      };

      const result = isObjectOf<string>(input, isString);
      expect(result).toBe(true);
    });

    test('returns false for an object that deviates from the type', () => {
      const input = {
        a: 'a',
        b: 'b',
        c: 1,
      };

      const result = isObjectOf<string>(input, isString);
      expect(result).toBe(false);
    });

    test('can use complex typeguards too', () => {
      type ValueSet = string | string[] | undefined;
      const isStringArray = isArrayOfGenerator(isString);
      const guard = unionGuard<ValueSet>(isString, isStringArray, isUndefined);

      // Test the guard
      expect(guard('hello')).toBe(true);
      expect(guard(['hello', 'world'])).toBe(true);
      expect(guard(undefined)).toBe(true);

      const input = {
        a: 'a',
        b: ['b', 'c'],
        c: undefined,
      };

      const result = isObjectOf<ValueSet>(input, guard);
      expect(result).toBe(true);
    });

    test('examples', () => {
      const boolObj = {
        a: true,
        b: false,
        c: true,
      };

      const badObj = {
        a: 1,
        b: 'b',
        c: true,
      };

      expect(isObjectOf<boolean>(boolObj, isBoolean)).toBe(true); // resolves to true
      expect(isObjectOf<boolean>(badObj, isBoolean)).toBe(false); // resolves to false

      interface Fun {
        a: string;
        b: number;
      }
      const isFun = typeGuardGenerator<Fun>({
        a: isString,
        b: isNumber,
      });

      const obj = {
        a: { a: 'a', b: 1 },
        b: { a: 'b', b: 2 },
        c: { a: 'c', b: 3 },
      };

      expect(isObjectOf<Fun>(obj, isFun)).toBe(true);
    });
  });
});

describe.skip('benchmarking object checking', () => {
  const regex = /^class /;

  function startsWithTest(functions: unknown[]) {
    const startsWithResults: boolean[] = [];
    const startsWithStart = performance.now();
    for (const func of functions) {
      const result = `${func}`.startsWith('class ');
      startsWithResults.push(result);
    }
    const startsWithEnd = performance.now();
    expect(startsWithResults.every((i) => i === false)).toBe(true);

    return {
      start: startsWithStart,
      end: startsWithEnd,
    };
  }

  function regexTest(functions: unknown[]) {
    const regexResults: boolean[] = [];
    const regexStart = performance.now();
    for (const func of functions) {
      const result = regex.test(`${func}`);
      regexResults.push(result);
    }
    const regexEnd = performance.now();
    expect(regexResults.every((i) => i === false)).toBe(true);

    return {
      start: regexStart,
      end: regexEnd,
    };
  }

  // It would appear that startsWith is as fast as regex for this test
  test('isFunction string checking', () => {
    const functions = Array.from({ length: 1000000 }, () => () => {});

    const swResults: { start: number; end: number }[] = [];
    const reResults: { start: number; end: number }[] = [];

    swResults.push(startsWithTest(functions));
    reResults.push(regexTest(functions));
    swResults.push(startsWithTest(functions));
    reResults.push(regexTest(functions));
    swResults.push(startsWithTest(functions));
    reResults.push(regexTest(functions));
    swResults.push(startsWithTest(functions));
    reResults.push(regexTest(functions));

    const swAvg =
      swResults.reduce((acc, curr) => acc + (curr.end - curr.start), 0) /
      swResults.length;
    const reAvg =
      reResults.reduce((acc, curr) => acc + (curr.end - curr.start), 0) /
      reResults.length;

    // eslint-disable-next-line no-console
    console.log({
      startsWithDiff: swAvg,
      regexDiff: reAvg,
    });
  });
});
