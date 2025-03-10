import { unionGuard } from '../generators/union';
import { isRecord } from './object';
import { isNumber, isString } from './primitives';

interface PotentialEnum {
  [key: string]: number | string;
}
const isStringOrNumber = unionGuard<string | number>(isString, isNumber);

export function isEnumValue<Type extends PotentialEnum>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any,
  enumValue: Type,
): input is Type[keyof Type] {
  return (
    isStringOrNumber(input) &&
    isRecord(enumValue) &&
    Object.values(enumValue).includes(input)
  );
}

export function isEnumValueGenerator<Type extends PotentialEnum>(
  enumValue: Type,
) {
  // TODO may be able to make this more efficient with
  // a map of values to keys
  return (input: unknown): input is Type[keyof Type] =>
    isEnumValue(input, enumValue);
}
