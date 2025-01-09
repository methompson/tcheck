export function isString(input: unknown): input is string {
  return typeof input === "string";
}

export function isNumber(input: unknown): input is number {
  return typeof input === "number";
}

export function isBoolean(input: unknown): input is boolean {
  return typeof input === "boolean";
}

export function isUndefined(input: unknown): input is undefined {
  return input === undefined;
}

export function isNull(input: unknown): input is null {
  return input === null;
}

export function isNullOrUndefined(input: unknown): input is null | undefined {
  return isUndefined(input) || isNull(input);
}

export function isBigInt(input: unknown): input is bigint {
  return typeof input === "bigint";
}

export function isSymbol(input: unknown): input is symbol {
  return typeof input === "symbol";
}
