import { TypeGuard } from './type';

export function not<T>(
  baseInput: TypeGuard<T>,
): (input: unknown) => input is Exclude<unknown, T> {
  return (input: unknown): input is Exclude<unknown, T> => !baseInput(input);
}
