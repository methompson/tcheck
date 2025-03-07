import { isArrayOf } from '../typeguards/array';
import { isInstanceOf } from '../typeguards/object';

/**
 * Generates a type guard that checks if the input is an instance of the given
 * Class. This is useful for creating type guards for classes that you can
 * pass around as a function without having to use the boilerplate of
 * `isInstanceOf`.
 */
export function isInstanceOfGenerator<T>(
  constructor: new (...args: never[]) => T,
): (input: unknown) => input is T {
  return (input) => isInstanceOf<T>(input, constructor);
}

/**
 * Generates a type guard that checks if the input is an array of the given
 * type. This is useful for creating type guards for arrays of a specific type
 * that you can pass around as a function without having to use the boilerplate
 * of `isArrayOf`.
 */
export function isArrayOfGenerator<T>(
  guard: (i: unknown) => boolean,
): (input: unknown) => input is T[] {
  return (input) => isArrayOf<T>(input, guard);
}
