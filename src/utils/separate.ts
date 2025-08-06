import { TypeGuard } from './type';

/**
 * Returns a function that takes an array of unknown values
 * The function separates all values that pass the type guard
 * from those that don't. It returns both arrays
 */
export function separate<T>(
  typeguard: TypeGuard<T>,
): (val: unknown[]) => [T[], Exclude<unknown, T>[]] {
  return (el: unknown[]) => {
    const is: T[] = [];
    const isNot: Exclude<unknown, T>[] = [];

    for (const value of el) {
      if (typeguard(value)) {
        is.push(value as T);
      } else {
        isNot.push(value as Exclude<unknown, T>);
      }
    }

    return [is, isNot];
  };
}

const separateFunc: <T>(
  typeguard: TypeGuard<T>,
) => (val: unknown[]) => [T[], Exclude<unknown, T>[]] = separate;

export function test() {
  return separateFunc;
}
