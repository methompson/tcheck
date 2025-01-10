import { isBoolean, isNumber, isString } from '../typeguards/primitives';
import {
  typeGuardGenerator,
  typeGuardTestGenerator,
} from './typeGuardGenerator';

describe('typeGuardGenerator', () => {
  test('makes a typeguard for the input', () => {
    interface MyFunInterface {
      key: string;
      num: number;
      bool: boolean;
    }
    const tg = typeGuardGenerator<MyFunInterface>({
      key: isString,
      num: isNumber,
      bool: isBoolean,
    });

    expect(typeof tg).toBe('function');

    expect(tg({ key: 'hello', num: 1, bool: true })).toBe(true);
    expect(tg({ key: 'hello', num: 1, bool: 'true' })).toBe(false);
  });

  test('a typeguard generated can be used in a nested interface', () => {
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

    const vsTG = typeGuardGenerator<ValueSet>({
      value: isString,
      isTrue: isBoolean,
    });

    const mfiTG = typeGuardGenerator<MyFunInterface>({
      key: isString,
      num: isNumber,
      bool: isBoolean,
      valueSet: vsTG,
    });

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

    expect(mfiTG(trueVal)).toBe(true);
    expect(mfiTG(falseVal)).toBe(false);
  });

  test('the value is correctly typeguarded', () => {
    interface MyFunInterface {
      key: string;
      num: number;
      bool: boolean;
    }
    const tg = typeGuardGenerator<MyFunInterface>({
      key: isString,
      num: isNumber,
      bool: isBoolean,
    });

    const myVal = {
      key: 'hello',
      num: 1,
      bool: true,
    };

    const myFunc = (input: MyFunInterface) => (input ? true : false);

    if (tg(myVal)) {
      expect(myFunc(myVal)).toBe(true);
    }

    expect.assertions(1);
  });
});

describe('typeGuardTestGenerator', () => {
  test('makes a typeguard test for the input and returns invalid values', () => {
    const tgTest = typeGuardTestGenerator({
      key: isString,
      num: isNumber,
      bool: isBoolean,
    });

    // All values are valid
    expect(tgTest({ key: 'hello', num: 1, bool: true })).toEqual([]);

    // Invalid values
    expect(tgTest('string')).toEqual(['root']);
    expect(tgTest({ key: 1, num: 1, bool: true })).toEqual(['key']);
    expect(tgTest({ key: 'hello', num: 1, bool: 'true' })).toEqual(['bool']);
    expect(tgTest({ key: 'hello', num: '1', bool: true })).toEqual(['num']);
    expect(tgTest({})).toEqual(['key', 'num', 'bool']);
  });

  test('a typeguard test can be nested in another typeguard test', () => {
    const childTest = typeGuardTestGenerator({
      value: isString,
      isTrue: isBoolean,
    });

    // nesting the vsTest in this test
    const parentTest = typeGuardTestGenerator({
      key: isString,
      num: isNumber,
      bool: isBoolean,
      valueSet: childTest,
    });

    expect(
      parentTest({
        key: 'key',
        num: 96,
        bool: false,
        valueSet: { value: 'hello', isTrue: true },
      }),
    ).toEqual([]);
    expect(
      parentTest({
        key: 'key',
        num: 96,
        bool: false,
        valueSet: { value: 'hello', isTrue: 'true' },
      }),
    ).toEqual(['valueSet.isTrue']);
    expect(
      parentTest({
        key: 'key',
        num: 96,
        bool: false,
        valueSet: { value: true, isTrue: 'true' },
      }),
    ).toEqual(['valueSet.value', 'valueSet.isTrue']);
  });

  test('The typeguard test can be used with an if statement', () => {
    interface MyFunInterface {
      key: string;
      num: number;
      bool: boolean;
    }
    const tg = typeGuardTestGenerator({
      key: isString,
      num: isNumber,
      bool: isBoolean,
    });

    const myVal1 = {
      key: 'hello',
      num: 1,
      bool: true,
    };
    const myVal2 = {
      key: 'hello',
      num: 1,
    };

    const myFunc = (input: MyFunInterface) => (input ? true : false);

    if (tg(myVal1).length === 0) {
      expect(myFunc(myVal1)).toBe(true);
    }

    // Will never run
    if (tg(myVal2).length === 0) {
      expect(true).toBe(false);
    }

    expect.assertions(1);
  });

  test('typeGuardTestGenerator results can be nested', () => {
    const innerTest = typeGuardTestGenerator({
      key: isString,
      value: isNumber,
    });

    const outerTest = typeGuardTestGenerator({
      key: isString,
      inner: innerTest,
    });

    const good = {
      key: 'hello',
      inner: { key: 'world', value: 1 },
    };

    const bad = {
      key: 'hello',
      inner: { key: 'world', value: '1' },
    };

    expect(outerTest(good)).toEqual([]);
    expect(outerTest(bad)).toEqual(['inner.value']);
  });
});
