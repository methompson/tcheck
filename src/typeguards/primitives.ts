/**
 * Determines if the input is a string.
 */
export function isString(input: unknown): input is string {
  return typeof input === 'string';
}

/**
 * Determines if the input is a non-empty string.
 */
export function isNonEmptyString(input: unknown): input is string {
  return isString(input) && input.length > 0;
}
export const isStringWithLength = isNonEmptyString;

/**
 * Determines if the input is a number.
 */
export function isNumber(input: unknown): input is number {
  return typeof input === 'number';
}

/**
 * Determines if the input is a boolean.
 */
export function isBoolean(input: unknown): input is boolean {
  return typeof input === 'boolean';
}

/**
 * Determines if the input is undefined
 */
export function isUndefined(input: unknown): input is undefined {
  return input === undefined;
}

/**
 * Determines if the input is null
 */
export function isNull(input: unknown): input is null {
  return input === null;
}

/**
 * Determines if the input is null or undefined
 */
export function isNullOrUndefined(input: unknown): input is null | undefined {
  return isUndefined(input) || isNull(input);
}
export const isUndefinedOrNull = isNullOrUndefined;

/**
 * Determines if the input is a BigInt
 */
export function isBigInt(input: unknown): input is bigint {
  return typeof input === 'bigint';
}

/**
 * Determines if the input is a symbol
 */
export function isSymbol(input: unknown): input is symbol {
  return typeof input === 'symbol';
}
