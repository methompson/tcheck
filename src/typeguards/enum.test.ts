import { isEnumValue, isEnumValueGenerator } from './enum';

enum TestEnum {
  Value1,
  Value2,
  Value3,
}

enum TestEnumString {
  Value1 = 'Value1',
  Value2 = 'Value2',
  Value3 = 'Value3',
}

describe('enum', () => {
  describe('isEnum', () => {
    test('should return true for number enum', () => {
      expect(isEnumValue(0, TestEnum)).toBe(true);
      expect(isEnumValue(1, TestEnum)).toBe(true);
      expect(isEnumValue(2, TestEnum)).toBe(true);
    });

    test('Should be able to use a function with the type', () => {
      function testMyGuard(input: TestEnumString) {
        expect(input).toBe(TestEnumString.Value1);
      }

      const val: unknown = 'Value1';
      if (isEnumValue(val, TestEnumString)) {
        testMyGuard(val);
      }
    });

    test('should return true for string enum', () => {
      expect(isEnumValue('Value1', TestEnumString)).toBe(true);
      expect(isEnumValue('Value2', TestEnumString)).toBe(true);
      expect(isEnumValue('Value3', TestEnumString)).toBe(true);
    });

    test('should return false for non-enum', () => {
      expect(isEnumValue(3, TestEnum)).toBe(false);
      expect(isEnumValue('Value4', TestEnumString)).toBe(false);
    });
  });

  describe('isEnuValueGenerator', () => {
    const isTestEnum = isEnumValueGenerator(TestEnum);
    const isTestEnumString = isEnumValueGenerator(TestEnumString);

    test('should return true for number enum value', () => {
      expect(isTestEnum(0)).toBe(true);
      expect(isTestEnum(1)).toBe(true);
      expect(isTestEnum(2)).toBe(true);
    });

    test('should return true for string enum values', () => {
      expect(isTestEnumString('Value1')).toBe(true);
      expect(isTestEnumString('Value2')).toBe(true);
      expect(isTestEnumString('Value3')).toBe(true);
    });

    test('should return false for non-enum values', () => {
      expect(isTestEnum(3)).toBe(false);
      expect(isTestEnumString('Value4')).toBe(false);
    });
  });
});
