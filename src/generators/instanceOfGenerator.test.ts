import { isInstanceOfGenerator } from './instanceOfGenerator';

describe('instanceOfGenerator', () => {
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
});
