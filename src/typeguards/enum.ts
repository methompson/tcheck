import { unionGuard } from '@/generators/union';
import { isRecord } from '@/typeguards/object';
import { isNumber, isString } from '@/typeguards/primitives';

interface PotentialEnum {
  [key: string]: number | string;
}
const isStringOrNumber = unionGuard<string | number>(isString, isNumber);

export function isEnumValue<T extends PotentialEnum>(
  input: unknown,
  enumValue: T,
): input is T[keyof T] {
  return (
    isStringOrNumber(input) &&
    isRecord(enumValue) &&
    Object.values(enumValue).includes(input)
  );
}

export function isEnumValueGenerator<T extends PotentialEnum>(enumValue: T) {
  // TODO may be able to make this more efficient with
  // a map of values to keys
  return (input: unknown): input is T[keyof T] => isEnumValue(input, enumValue);
}
