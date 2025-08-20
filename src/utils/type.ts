/**
 * A TypeGuard type is simply a function that takes an unknown value
 * and returns a boolean indicating whether the value is of the expected type.
 * This uses a type predicate to ensure TypeScript understands the type narrowing.
 */
export type TypeGuard<T> = (value: unknown) => value is T;

/**
 * This is a more loose input that can either be a TypeGuard or a function
 * that takes an unknown value and returns a boolean. This is useful for
 * cases where you want to use a custom function to check the type without
 * the rigmarole of an explicit TypeGuard.
 */
export type TypeGuardInput<T> = TypeGuard<T> | ((value: unknown) => boolean);

/**
 * The typeGuardGeneratorInterface is an object where the keys are the keys of an
 * interface/object that you are type checking and the values are the type
 * guard functions that you want to use to check the values of the keys.
 */
export type TypeGuardGeneratorInput = {
  [key: string]: TypeGuardInput<unknown>;
};
