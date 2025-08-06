import { not } from './utils/not';
import { isString } from './typeguards/primitives';

describe('Array Filtering', () => {
  test('can filter out non-string values from an array', () => {
    const mixedArray = [1, 'hello', true, null, 'world', undefined];
    const filteredArray = mixedArray.filter(isString);
    expect(filteredArray).toEqual(['hello', 'world']);
  });

  test('Can keep non-string values in an array', () => {
    const mixedArray = [1, 'hello', true, null, 'world', undefined];
    const filteredArray = mixedArray.filter(not(isString));
    expect(filteredArray).toEqual([1, true, null, undefined]);
  });
});
