import { isInstanceOf } from '../typeguards/object';
import { isNumber, isString, isUndefined } from '../typeguards/scalars';
import { unionGuard } from './union';

describe('Union type', () => {
  test('can be used to create a type guard for multiple types', () => {
    const guard = unionGuard<string | number>(isString, isNumber);

    expect(guard('a')).toBe(true);
    expect(guard(1)).toBe(true);

    expect(guard(true)).toBe(false);
  });

  test('can be used to guard against complex types', () => {
    const guard = unionGuard<string | number | Date | undefined>(
      isString,
      isNumber,
      (input: unknown) => isInstanceOf<Date>(input, Date),
      isUndefined,
    );

    expect(guard('a')).toBe(true);
    expect(guard(1)).toBe(true);
    expect(guard(new Date())).toBe(true);
    expect(guard(undefined)).toBe(true);

    expect(guard(true)).toBe(false);
    expect(guard(null)).toBe(false);
    expect(guard({})).toBe(false);
    expect(guard([])).toBe(false);
  });
});
