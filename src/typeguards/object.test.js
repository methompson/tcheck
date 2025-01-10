import { isInstanceOf } from './object';

describe('isInstanceOf', () => {
  test('should return true if the input is an ES5 class', () => {
    function AClass() {}
    AClass.prototype.a = function a() {};

    const a = new AClass();

    expect(isInstanceOf(a, AClass)).toBe(true);
  });
});
