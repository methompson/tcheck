import { unionGuard } from '../generators/union';
import { isRecord } from './object';
import { isNumber, isString, isUndefined } from './primitives';

interface PotentialEnum {
  [key: string]: number | string;
}
const isStringOrNumber = unionGuard<string | number>(isString, isNumber);

export function isEnumValue<Type extends PotentialEnum>(
  input: unknown,
  enumValue: Type,
): input is Type[keyof Type] {
  return (
    isStringOrNumber(input) &&
    isRecord(enumValue) &&
    !isUndefined(enumValue[input])
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
