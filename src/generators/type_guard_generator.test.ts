import { isBoolean, isNumber, isString } from '../typeguards/primitives';
import { makeTypeGuard, makeTypeGuardTest } from './type_guard_generator';

describe('makeTypeGuard', () => {
  test('makes a typeguard for the input', () => {
    interface MyFunInterface {
      key: string;
      num: number;
      bool: boolean;
    }
    const tg = makeTypeGuard<MyFunInterface>({
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

    const vsTG = makeTypeGuard<ValueSet>({
      value: isString,
      isTrue: isBoolean,
    });

    const mfiTG = makeTypeGuard<MyFunInterface>({
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
    const tg = makeTypeGuard<MyFunInterface>({
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

describe('makeTypeGuardTest', () => {
  test('makes a typeguard test for the input', () => {
    const tgTest = makeTypeGuardTest({
      key: isString,
      num: isNumber,
      bool: isBoolean,
    });

    expect(tgTest('string')).toEqual(['root']);
    expect(tgTest({ key: 'hello', num: 1, bool: true })).toEqual([]);
    expect(tgTest({ key: 1, num: 1, bool: true })).toEqual(['key']);
    expect(tgTest({ key: 'hello', num: 1, bool: 'true' })).toEqual(['bool']);
    expect(tgTest({ key: 'hello', num: '1', bool: true })).toEqual(['num']);
    expect(tgTest({})).toEqual(['key', 'num', 'bool']);
  });

  test('a typeguard test generated can be used in a nested interface', () => {
    // interface ValueSet {
    const vsTest = makeTypeGuardTest({
      value: isString,
      isTrue: isBoolean,
    });

    // interface MyFunInterface {
    const mfiTest = makeTypeGuardTest({
      key: isString,
      num: isNumber,
      bool: isBoolean,
      valueSet: vsTest,
    });

    expect(
      mfiTest({
        key: 'key',
        num: 96,
        bool: false,
        valueSet: { value: 'hello', isTrue: true },
      }),
    ).toEqual([]);
    expect(
      mfiTest({
        key: 'key',
        num: 96,
        bool: false,
        valueSet: { value: 'hello', isTrue: 'true' },
      }),
    ).toEqual(['valueSet.isTrue']);
    expect(
      mfiTest({
        key: 'key',
        num: 96,
        bool: false,
        valueSet: { value: true, isTrue: 'true' },
      }),
    ).toEqual(['valueSet.value', 'valueSet.isTrue']);
  });

  test('the value is correctly typeguarded', () => {
    interface MyFunInterface {
      key: string;
      num: number;
      bool: boolean;
    }
    const tg = makeTypeGuardTest({
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
