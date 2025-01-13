import { isArray } from '../typeguards/array';
import { isRecord } from '../typeguards/object';

// The typeGuardGeneratorInterface is an object where the keys are the keys of an
// interface/object that you are type checking and the values are the type
// guard functions that you want to use to check the values of the keys.
interface TypeGuardGeneratorInput {
  [key: string]: (input: unknown) => boolean;
}

// The TypeGuardTestInput is a union of two different function types.
// The first is similar to the typical TypeGuard function where you get
// a boolean output. The second is a type guard test that returns an array
// of strings. This allows us to use both a type guard and type guard test
// in the same generator.
type TypeGuardTestInput =
  | ((input: unknown) => boolean)
  | ((input: unknown) => string[]);

// The TypeGuardTestGeneratorInput is an object where the keys are the keys of an
// interface/object that you are type checking and the values are the type
// guard functions or type guard test functions that you want to use to check
// the values of the keys.
interface TypeGuardTestGeneratorInput {
  [key: string]: TypeGuardTestInput;
}

/**
 * Exports a function that can test if an object conforms to a
 * given interface. The output is an array of strings that
 * represent the path to the invalid key. This is useful for determining
 * which keys are invalid
 */
export function typeGuardTestGenerator(
  input: TypeGuardTestGeneratorInput,
): (input: unknown) => string[] {
  return (valueInput: unknown): string[] => {
    if (!isRecord(valueInput)) {
      return ['root'];
    }

    return Object.entries(input)
      .map(([key, value]) => {
        // Here we perform the type guard op on the value.
        const rawResult = value?.(valueInput[key]);

        // If the result is an array, that means we used a type guard test
        // that returns a string array. If we did that, we want to use those
        // values to indicate which keys from the object are invalid.
        if (isArray(rawResult)) {
          // If Zero length, it's not a problem.
          if (rawResult.length === 0) {
            return undefined;
          }

          // If there are values, we want to prepend the key to the values
          // and return all of the values from the array.
          const result = rawResult.map((value) => `${key}.${value}`);
          return result;
        }

        return !rawResult ? key : undefined;
      })
      .flat() // Turn the array of arrays into a single array
      .filter((value) => value !== undefined); // remove all undefined values, which are valid keys
  };
}

/**
 * Exports a function that can test if an object conforms to a
 * given interface. The output is a boolean and returns the TS
 * typeguard output. This can be used to type an unknown value.
 */
export function typeGuardGenerator<T>(
  input: TypeGuardGeneratorInput,
): (input: unknown) => input is T {
  return (valueInput: unknown): valueInput is T => {
    if (!isRecord(valueInput)) {
      return false;
    }

    return Object.entries(input).every(
      ([key, value]) => value?.(valueInput[key]) ?? false,
    );
  };
}

/**
 * Exports a function that can test if an object has non-specific
 * keys with values that conform to a specific interface or
 * type.
 * e.g. { [key: string]: boolean }
 * e.g. { [key: string]: { [key: string]: boolean } }
 *
 * This test will confirm that the object's values are of
 * the correct type.
 */
export function indexedObjectTypeGuardGenerator<T>(
  tg: (input: unknown) => boolean,
): (input: unknown) => input is T {
  return (valueInput: unknown): valueInput is T => {
    if (!isRecord(valueInput)) {
      return false;
    }

    return Object.values(valueInput).every(tg);
  };
}
