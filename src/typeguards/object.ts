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
