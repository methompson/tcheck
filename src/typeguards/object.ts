import { TypeGuard, TypeGuardGeneratorInput } from '../utils/type';

/**
 * Checks if the value is an object. This function is very permissive,
 * so it will return true for plain object, instances from classes, etc.
 * It returns false for object-like values, like arrays and functions.
 */
export function isRecord(input: unknown): input is Record<string, unknown> {
  return !!input && typeof input === 'object' && !Array.isArray(input);
}

/**
 * Alias for `isRecord`. TS calls regular objects "records".
 * e.g. Record<string, unknown>
 */
export const isObject = isRecord;

/**
 * Checks that this is a function. If the value is an ES6 class, it will return false
 * ES5 & ES6 classes are also considered functions. This is just how JavaScript works.
 * This function is permissive and relatively quick, but some built-in functions
 * will pass through that cannot be called, like Uint8Array, which will throw
 * an error if called directly.
 */
export function isFunction(input: unknown): input is Function {
  return typeof input === 'function' && !input.toString().startsWith('class ');
}

/**
 * Type guard to check if an input is an instance of a class.
 * You can pass in the class constructor itself as the second argument.
 * e.g. `isInstanceOf<Date>(input, Date)`
 * or in JS: `isInstanceOf(input, Date)`
 */
export function isInstanceOf<T>(
  input: unknown,
  constructor: new (...args: never[]) => T,
): input is T {
  return typeof input === 'object' && input instanceof constructor;
}

/**
 * Type guard to test if an object conforms to a given interface.
 */
export function isInterfaceOf<T>(
  valueInput: unknown,
  tgInput: TypeGuardGeneratorInput,
): valueInput is T {
  if (!isRecord(valueInput)) {
    return false;
  }

  return Object.entries(tgInput).every(
    ([key, value]) => value?.(valueInput[key]) ?? false,
  );
}

/**
 * Type guard to test if an object conforms to a given interface.
 * This function differs from the `isInterfaceOf` function because
 * it will also make sure there are no extra values in the object
 * that are not part of the interface.
 */
export function isInterfaceOfStrict<T>(
  valueInput: unknown,
  tgInput: TypeGuardGeneratorInput,
): valueInput is T {
  if (!isRecord(valueInput)) {
    return false;
  }

  const inputKeys = Object.keys(valueInput);
  const tgKeys = Object.keys(tgInput);

  if (tgKeys.length !== inputKeys.length) {
    return false;
  }

  if (!tgKeys.every((key) => inputKeys.includes(key))) {
    return false;
  }

  return isInterfaceOf<T>(valueInput, tgInput);
}

/**
 * Type guard to test if an object has non-specific keys that
 * conform to a specific interface or type.
 * e.g. { [key: string]: boolean }
 * e.g. { [key: string]: { [key: string]: boolean } }
 */
export function isObjectOf<T>(
  input: unknown,
  tg: TypeGuard<T>,
): input is Record<string | number, T> {
  if (!isRecord(input)) {
    return false;
  }

  return Object.values(input).every(tg);
}
