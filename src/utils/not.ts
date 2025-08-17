import { TypeGuard } from '@/utils/type';

export function not<U, T>(
  baseInput: TypeGuard<T>,
): (input: U) => input is Exclude<U, T> {
  return (input: U): input is Exclude<U, T> => !baseInput(input);
}
