import { not } from './not';
import { isString, isNumber, isBoolean } from './primitives';
import { typeGuardGenerator } from '../generators/typeGuardGenerator';

import { unionGuard } from '../generators/union';

describe('not', () => {
  test('Checks the opposite of the passed in type guard', () => {
    const notString = not(isString);
    expect(notString('test')).toBe(false);
    expect(notString(123)).toBe(true);
  });

  test('Can be used for filtering', () => {
    const mixedArray = [1, 'hello', true, null, 'world', undefined];
    const filteredArray = mixedArray.filter(not(isString));
    expect(filteredArray).toEqual([1, true, null, undefined]);
  });

  test('can be used with complex typeguards', () => {
    interface User {
      id: string;
      name: string;
      age: number;
    }

    const isUser = typeGuardGenerator<User>({
      id: isString,
      name: isString,
      age: isNumber,
    });

    const isUserOrStringOrBoolean = unionGuard<User | string | boolean>(
      isUser,
      isString,
      isBoolean,
    );

    const mixedArray = [
      {},
      { id: '1' },
      1,
      'hello',
      true,
      null,
      'world',
      undefined,
      {
        id: 'a',
        name: 'name',
        age: 99,
      },
    ];

    const notUserStringBool = not(isUserOrStringOrBoolean);

    // Should include 5 elements, 2 objects, 1 number, null and undefined
    const values = mixedArray.filter(notUserStringBool);

    expect(values).toHaveLength(5);
    expect(values).toEqual([{}, { id: '1' }, 1, null, undefined]);
  });
});
