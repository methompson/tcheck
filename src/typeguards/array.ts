import { TypeGuard } from '../utils/type';

/**
 * Checks that the value is an array. The contents do not matter
 * to this function. Use this instead of just `Array.isArray` to
 * get `unknown[]` instead of `any[]`. This makes the type more
 * strict and forces the user to check the contents of the array.
 */
export function isArray(input: unknown): input is unknown[] {
  return Array.isArray(input);
}

/**
 * Checks that the value is an array and that all of its elements
 * pass the given guard. This is useful for checking that an array
 * is homogenous.
 */
export function isArrayOf<T>(
  input: unknown,
  guard: TypeGuard<T> | ((input: unknown) => boolean),
): input is T[] {
  if (!isArray(input)) {
    return false;
  }

  return input.every(guard);
}
