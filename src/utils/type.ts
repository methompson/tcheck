export type TypeGuard<T> = (value: unknown) => value is T;

// The typeGuardGeneratorInterface is an object where the keys are the keys of an
// interface/object that you are type checking and the values are the type
// guard functions that you want to use to check the values of the keys.
export type TypeGuardGeneratorInput = {
  [key: string]: TypeGuard<unknown>;
};
