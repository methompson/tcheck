import { isInstanceOf } from '../typeguards/object';

export function isInstanceOfGenerator<T>(
  constructor: new (...args: unknown[]) => T,
): (input: unknown) => input is T {
  return (input) => isInstanceOf<T>(input, constructor);
}
