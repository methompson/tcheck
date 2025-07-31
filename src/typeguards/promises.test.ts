import { isPromiseFulfilled, isPromiseRejected, isPromise } from './promises';

const promiseResolved = async () => {};
const promiseRejected = async () => {
  throw new Error('Rejected');
};

describe('Promise Type Guards', () => {
  describe('isPromise', () => {
    test('should recognize a Promise', () => {
      const promise1 = new Promise((resolve) => resolve('test'));
      expect(isPromise(promise1)).toBe(true);

      const promise2 = Promise.resolve('test');
      expect(isPromise(promise2)).toBe(true);

      const promise3 = (async () => 'test')();
      expect(isPromise(promise3)).toBe(true);
    });

    test('should recognize non-Promise values', () => {
      expect(isPromise(123)).toBe(false);
      expect(isPromise('test')).toBe(false);
      expect(isPromise({})).toBe(false);
      expect(isPromise([])).toBe(false);
      expect(isPromise(null)).toBe(false);
      expect(isPromise(undefined)).toBe(false);
    });
  });

  test('should recognize when promiess are resolved', async () => {
    const results = await Promise.allSettled([promiseResolved()]);

    expect(results.length).toBe(1);
    expect(isPromiseFulfilled(results[0])).toBe(true);
  });

  test('should recognize when promises are rejected', async () => {
    const results = await Promise.allSettled([promiseRejected()]);

    expect(results.length).toBe(1);
    expect(isPromiseRejected(results[0])).toBe(true);
  });

  test('should be able to be used with mixed resolved and rejected promises', async () => {
    const results = await Promise.allSettled([
      promiseResolved(),
      promiseRejected(),
    ]);

    const fulfilled = results.filter(isPromiseFulfilled);
    const rejected = results.filter(isPromiseRejected);

    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);
  });
});
