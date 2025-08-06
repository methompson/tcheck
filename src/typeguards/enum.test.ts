import { isEnumValue, isEnumValueGenerator } from '@/typeguards/enum';

enum TestEnum {
  Value1,
  Value2,
  Value3,
}

enum TestEnumString {
  Value1 = 'value1',
  Value2 = 'value2',
  Value3 = 'value3',
}

describe('enum', () => {
  describe('isEnumValue', () => {
    test('should return true for number enum', () => {
      expect(isEnumValue(0, TestEnum)).toBe(true);
      expect(isEnumValue(1, TestEnum)).toBe(true);
      expect(isEnumValue(2, TestEnum)).toBe(true);
    });

    test('Should be able to use a function with the type', () => {
      function testMyGuard(input: TestEnumString) {
        expect(input).toBe(TestEnumString.Value1);
      }

      const val: unknown = 'value1';
      if (isEnumValue(val, TestEnumString)) {
        testMyGuard(val);
      }
    });

    test('should return true for string enum', () => {
      expect(isEnumValue('value1', TestEnumString)).toBe(true);
      expect(isEnumValue('value2', TestEnumString)).toBe(true);
      expect(isEnumValue('value3', TestEnumString)).toBe(true);
    });

    test('should return false for non-enum', () => {
      expect(isEnumValue(3, TestEnum)).toBe(false);
      expect(isEnumValue('Value4', TestEnumString)).toBe(false);
    });
  });

  describe('isEnumValueGenerator', () => {
    const isTestEnum = isEnumValueGenerator(TestEnum);
    const isTestEnumString = isEnumValueGenerator(TestEnumString);

    test('should return true for number enum value', () => {
      expect(isTestEnum(0)).toBe(true);
      expect(isTestEnum(1)).toBe(true);
      expect(isTestEnum(2)).toBe(true);
    });

    test('should return true for string enum values', () => {
      expect(isTestEnumString('value1')).toBe(true);
      expect(isTestEnumString('value2')).toBe(true);
      expect(isTestEnumString('value3')).toBe(true);
    });

    test('Should be able to use a function with the type', () => {
      expect.assertions(1);
      function testMyGuard(input: TestEnumString) {
        expect(input).toBe(TestEnumString.Value1);
      }

      const val: unknown = 'value1';
      if (isTestEnumString(val)) {
        testMyGuard(val);
      }
    });

    test('should return false for non-enum values', () => {
      expect(isTestEnum(3)).toBe(false);
      expect(isTestEnumString('Value4')).toBe(false);
    });
  });
});
