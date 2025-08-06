import { isString } from '@/typeguards/primitives';
import { separate } from '@/utils/separate';

describe('separate', () => {
  it('should separate values based on the type guard', () => {
    const [strings, nonStrings] = separate(isString)([
      'hello',
      42,
      'world',
      true,
    ]);
    expect(strings).toEqual(['hello', 'world']);
    expect(nonStrings).toEqual([42, true]);
  });

  it('should return empty arrays when given an empty array', () => {
    const [strings, nonStrings] = separate(isString)([]);
    expect(strings).toEqual([]);
    expect(nonStrings).toEqual([]);
  });

  it('should return all values in the first array if all pass the type guard', () => {
    const [strings, nonStrings] = separate(isString)(['a', 'b', 'c']);
    expect(strings).toEqual(['a', 'b', 'c']);
    expect(nonStrings).toEqual([]);
  });

  it('should return all values in the second array if none pass the type guard', () => {
    const [strings, nonStrings] = separate(isString)([1, 2, 3]);
    expect(strings).toEqual([]);
    expect(nonStrings).toEqual([1, 2, 3]);
  });
});
