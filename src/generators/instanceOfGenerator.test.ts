import { isInstanceOfGenerator } from './instanceOfGenerator';

describe('instanceOfGenerator', () => {
  test('creates a generator for a type checker for a class that works as intended', () => {
    const isDate = isInstanceOfGenerator<Date>(Date);

    expect(isDate(new Date())).toBe(true);
    expect(isDate(new Date().toISOString())).toBe(false);
  });
});
