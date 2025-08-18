import { TypeGuard, TypeGuardInput } from '@/utils/type';

/**
 * Generates a type guard for union types, i.e. types that have the
 * pipe operator `|` in them. It accepts multiple type guards and
 * returns a new type guard that checks if the input matches any of
 * the given type guards.
 *
 * Example usage:
 * const isStringOrNumber = unionGuard<string | number>(isString, isNumber);
 * isStringOrNumber('hello'); // true
 * isStringOrNumber(42); // true
 * isStringOrNumber(true); // false
 */
export function unionGuard<T>(
  ...guards: TypeGuardInput<unknown>[]
): TypeGuard<T> {
  return (input: unknown): input is T => guards.some((guard) => guard(input));
}
