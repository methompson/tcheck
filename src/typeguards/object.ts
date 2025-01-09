export function isRecord(input: unknown): input is Record<string, unknown> {
  return !!input && typeof input === 'object' && !Array.isArray(input);
}

export const isObject = isRecord;

/**
 * Checks that this is a function.
 * ES5 & ES6 classes are also considered functions. This is just how JavaScript works.
 */
export function isFunction(input: unknown): input is Function {
  return typeof input === 'function' && input instanceof Function;
}

/**
 * Checks that this is a function.
 * Tries to return false for classes.
 */
export function isStrictFunction(input: unknown): input is Function {
  if (!isFunction(input)) {
    return false;
  }

  if (input.toString().startsWith('class ')) {
    return false;
  }

  // Testing for values added to the prototype, i.e. methods
  const proto = Object.getOwnPropertyDescriptors(input).prototype;

  // Short closures don't have a prototype value.
  if (!proto) {
    return true;
  }

  const protoKeys = Object.keys(proto.value);
  if (protoKeys.length > 0) {
    return false;
  }

  // Testing for other values added to the function itself,
  // i.e. static methods & values
  const objKeys: string[] = [];
  for (const key in input) {
    objKeys.push(key);
  }

  return objKeys.length === 0;
}

/**
 * Type guard to check if an input is an instance of a class.
 * You can pass in the class constructor itself as the second argument.
 * e.g. `isInstanceOf<Date>(input, Date)`
 * or in JS: `isInstanceOf(input, Date)`
 */
export function isInstanceOf<T>(
  input: unknown,
  constructor: new (...args: unknown[]) => T,
): input is T {
  return typeof input === 'object' && input instanceof constructor;
}
