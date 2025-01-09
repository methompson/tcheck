import { isArray } from '../typeguards/array';
import { isRecord } from '../typeguards/object';

interface MakeTypeGuardInterface {
  [key: string]: (input: unknown) => boolean;
}

type TypeGuardTestInput =
  | ((input: unknown) => boolean)
  | ((input: unknown) => string[]);

interface MakeTypeGuardTestInput {
  [key: string]: TypeGuardTestInput;
}

/**
 * Exports a function that can test if an object conforms to a
 * given interface. The output is an array of strings that
 * represent the path to the invalid key. This is useful for determining
 * which keys are invalid
 */
export function makeTypeGuardTest(
  input: MakeTypeGuardTestInput,
): (input: unknown) => string[] {
  return (valueInput: unknown): string[] => {
    if (!isRecord(valueInput)) {
      return ['root'];
    }

    const outputRaw = Object.entries(input).map(([key, value]) => {
      const rawResult = value?.(valueInput[key]);
      if (isArray(rawResult)) {
        if (rawResult.length === 0) {
          return undefined;
        }

        return rawResult.map((value) => `${key}.${value}`);
      }
      const result = isArray(rawResult) ? rawResult.length === 0 : rawResult;

      return !result ? key : undefined;
    });

    const output = outputRaw.flat().filter((value) => value !== undefined);

    return output;
  };
}

/**
 * Exports a function that can test if an object conforms to a
 * given interface. The output is a boolean and returns the TS
 * typeguard output. This can be used to type an unknown value.
 */
export function makeTypeGuard<T>(
  input: MakeTypeGuardInterface,
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
