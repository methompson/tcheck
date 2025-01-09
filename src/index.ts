export { isArray, isArrayOf } from './typeguards/array';
export {
  isRecord,
  isObject,
  isFunction,
  isStrictFunction,
  isInstanceOf,
} from './typeguards/object';
export {
  isString,
  isNumber,
  isBoolean,
  isUndefined,
  isNull,
  isNullOrUndefined,
  isBigInt,
  isSymbol,
} from './typeguards/primitives';

export {
  isInstanceOfGenerator,
  isArrayOfGenerator,
} from './generators/instanceOfGenerator';
export {
  makeTypeGuardTest,
  makeTypeGuard,
} from './generators/type_guard_generator';
export { unionGuard } from './generators/union';
