import { isRecord } from '@/typeguards/object';

/**
 * Determines if the input is a Promise.
 */
export function isPromise(input: unknown): input is Promise<unknown> {
  return isRecord(input) && input instanceof Promise;
}

/**
 * Determines if a PromiseSettledResult is a PromiseRejectedResult.
 * Used from Promise.allResolved
 */
export function isPromiseRejected(
  input: PromiseSettledResult<unknown>,
): input is PromiseRejectedResult {
  return input.status === 'rejected';
}

/**
 * Determines if a PromiseSettledResult is a PromiseFulfilledResult.
 * Used from Promise.allResolved
 */
export function isPromiseFulfilled<T>(
  input: PromiseSettledResult<T>,
): input is PromiseFulfilledResult<T> {
  return input.status === 'fulfilled';
}
