import { isInstanceOf } from '@/typeguards/object';
import {
  isNull,
  isNumber,
  isString,
  isUndefined,
} from '@/typeguards/primitives';
import { unionGuard } from '@/generators/union';

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

  test('union types can be combined', () => {
    const isNullOrUndefined = unionGuard<null | undefined>(isNull, isUndefined);
    const isStringOrNullOrUndefined = unionGuard<string | null | undefined>(
      isNullOrUndefined,
      isString,
    );

    expect(isNullOrUndefined(null)).toBe(true);
    expect(isNullOrUndefined(undefined)).toBe(true);
    expect(isNullOrUndefined('')).toBe(false);

    expect(isStringOrNullOrUndefined(null)).toBe(true);
    expect(isStringOrNullOrUndefined(undefined)).toBe(true);
    expect(isStringOrNullOrUndefined('')).toBe(true);
  });

  test('returns false for values not in the union', () => {
    const guard = unionGuard<string | number>(isString, isNumber);

    expect(guard(true)).toBe(false);
    expect(guard(null)).toBe(false);
    expect(guard({})).toBe(false);
    expect(guard([])).toBe(false);
    expect(guard(BigInt(1))).toBe(false);
    expect(guard(Symbol())).toBe(false);
  });
});
