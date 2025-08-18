# @metools/tcheck

### A Simple JS & TS Type Checking Library.

Welcome to TCheck. TCheck is a simple type checking library that aims to make it easier to determine what kinds of variables and data you have in JavaScript and TypeScript alike.

### Basic Examples

At its heart, all the functions are just simple type predicate functions that check that a value conforms to your expectations.

You can easily confirm that your values are correct:

```ts
isString('test'); // resolve to true. Tells TS that this is a string
isBoolean('true'); // resolves to false. Tells TS that this is NOT a boolean
```

You can use the functions to make sure that your `unknown` or `any` values are actually the type that you need for a function to work correctly.

```ts
// Parsing a JSON value from a hypothetical API call
function parse(response: unknown) {
  // Check that the response is actually a string
  if (!isString(response)) {
    // If not, throw an error
    throw new Error('Oh no!');
  }

  // Run the parsing operation
  return JSON.parse(response);
}
```

You can also perform the opposite using the `not` function.

```ts
const myStr = 'hello, world';
const myNum = 12345;

isString(myStr); // Resolves to true
not(isString)(myNum); // Resolves to true
```

You can use the functions to check more complex objects, interfaces, etc. If you've defined an interface and you want to make sure that an object you receive conforms to its requirements, you can generate a type guard:

```ts
// Regular interface
interface MyFunInterface {
  key: string;
  num: number;
  bool: boolean;
}

// Generated type guard
const mfiTg = typeGuardGenerator<MyFunInterface>({
  key: isString,
  num: isNumber,
  bool: isBoolean,
});

// Objects to test
const a = {
  key: 'key',
  num: 10,
  bool: false,
};
const b = {
  key: 'key',
  num: '10',
  bool: true,
};

mfiTg(a); // resolves to true
mfiTg(b); // resolves to false
```

You can also use these functions for filtering elements out of a list. For example, if you receive API data but the data is sometimes non-conforming to types you're expecting (which can be common during periods of heavy development), you may want to filter out the non-conforming data for other use cases. You can readily use the `Array.prototype.filter` function to get your data.

```ts
const mixedArray = [1, 'hello', true, null, 'world', undefined];
const strArray = mixedArray.filter(isString);
const nonStrArray = mixedArray.filter(not(isString));
```

In the above example, `strArray` becomes an array of strings and properly typed in TypeScript.

The `separate` function was also developed specifically for an all-in-one example above:

```ts
const [strArray, nonStrArray] = separate(isString)(mixedArray);
```

The purpose of the project was to make it easier to avoid dreaded type-related errors like `undefined is not an object` and other problems that arise when you think you have one data type, but you, in fact, have another.

The package does two separate things that eventually accomplish the same goal, depending on whether you're using TypeScript or JavaScript. For TypeScript, the type guards will let the engine know that a variable is of a specific type. For JavaScript, the functions just return booleans, so you can use if statements to check what you have. Ultimately, the functions will let you know what kinds of data you have (or don't have).

All type guards in this package are written to use [TypeScript's type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates). This means that you can drop a typeguard in and if it resolves to `true`, TypeScript will assume that the value in question is what you say it is. This means that you can slide this into the TS type system without any kludges. They also work well with a JS project using JSDoc to annotate types.

As alluded above, all the type predicate functions resolve to a boolean value, meaning that you can just check whether your value is `true` or `false` and just assume the value has succeeded or failed the check.

The package includes the following functions:

- Typeguards for all [JavaScript Primitives](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)
- Type guards for objects, functions and instances of classes
- Type guards for arrays, including testing the values in an array
- Type guard generators that create functions that allow you to test complex objects
- Type guard test generators that allow you to test objects to determine what values are incorrect
- Union type type guard generators that allow you to generate type guards for any combination of types.

## Basic Types

```ts
type TypeGuard<T> = (value: unknown) => value is T;
type TypeGuardGeneratorInput = {
  [key: string]: TypeGuard<unknown>;
};
```

There are two exported types that are used in the project to denote types. The `TypeGuard` type is an alias for any function that returns a TypeScript type predicate, i.e. using the `is` keyword to denote that an argument is a specific type.

## Primitives

The primitive type guards test for all of JavaScript's basic primitive types:

```ts
isString: (input: unknown) => input is string
isNumber: (input: unknown) => input is number
isBoolean: (input: unknown) => input is boolean
isUndefined: (input: unknown) => input is undefined
isNull: (input: unknown) => input is null
isBigInt: (input: unknown) => input is BigInt
isSymbol: (input: unknown) => input is Symbol

isNullOrUndefined: (input: unknown) => input is undefined | null
isUndefinedOrNull: (input: unknown) => input is undefined | null
```

Plus `isNullOrUndefined` and its alias `isUndefinedOrNull` to test for either null or undefined.

### Examples

```ts
isString('string'); // Resolves to true
isNumber(0); // Resolves to true
isBoolean(true); // Resolves to true
isUndefined(undefined); // Resolves to true
isNull(null); // Resolves to true
isBigInt(BigInt(0)); // Resolves to true
isSymbol(Symbol()); // Resolves to true
```

## Objects

```ts
isObject: (input: unknown) => input is Record<string | number, unknown>
isRecord: (input: unknown) => input is Record<string | number, unknown>
```

The object type guards test for regular objects, functions and instances from classes. In the TypeScript ecosystem a regular object is actually called a "Record", which is where the `isRecord` function comes from, but an alias for `isObject` is also available for those that find it easier to remember.

It's important to note that in JavaScript, some types are actually another type. For instance, Arrays are objects, null is an object and Classes are functions:

```ts
function hello() {}
typeof hello; // resolves to 'function'

class Goodbye {}
typeof GoodBye; // resolves to 'function'

const goodBye = new GoodBye();
typeof goodbye; // resolves to 'object'

const myArr = [];
typeof myArr; // resolves to 'object'
```

As such, some typecheck functions go the extra mile to make sure that the data is actually what we think it is.

### Examples

The `isRecord`/`isObject` function tests to make sure that values are bona-fide objects. Arrays and null are both considered objects, but we should not consider them as such for practical purposes.

```ts
isRecord({ a: 'a', b: 10, c: true }); // resolves to true
isRecord(new Date()); // resolves to true
isRecord(Date); // resolves to false
isRecord([]); // resolves to false
isRecord(null); // resolves to false
```

## Functions

```ts
isFunction: (input: unknown) => input is Function
```

`isFunction` will test that values are functions. This isn't terribly strict, so some values will also return true, even though we don't consider them practically a function, like classes. As such, `isStrictFunction` will test that basic, callable functions return true. The purpose of `isStrictFunction` is to attempt to discern the spirit of type checking and only provide functions that are callable. ES5 classes tend to be callable, whereas ES6 classes (using the class keyword) cannot.

### Examples

```ts
function testA() {}
const testB = () {}

function Es5Class() {}
Es5Class.prototype.myMethod = () => {};
Es5Class.myStaticValue = 42;

class Es6Class {}

isFunction(testA); // resolves to true
isFunction(testB); // resolves to true
isFunction(Es5Class); // resolves to true
isFunction(Es6Class); // resolves to false
isFunction(Date); // resolves to true
```

## isInstanceOf

```ts
isInstanceOf: <T>(
  input: unknown,
  constructor: new (...args: never[]) => T,
) => input is T

isInstanceOfGenerator: <T>(
  constructor: new (...args: never[]) => T,
) => TypeGuard<T>;
```

`isInstanceOf` is meant to allow you to determine that a value is an instance of a class. This function works for both ES5 & ES6 style classes. This function is a bit cumbersome to use, which is why the `isInstanceOfGenerator` is preferred over using this.

### Examples

```ts
class ES6Class {}
const inst = new ES6Class();

isInstanceOf<ES6Class>(inst, ES6Class); // resolves to true
```

ES5 classes are a bit cumbersome to pass into TypeScript.

```ts
interface AClassInterface {
  a(): void;
}
interface AClassConstructor {
  new (...args: never[]): AClassInterface;
}
const AClass = function (this: AClassInterface) {} as any as AClassConstructor;
AClass.prototype.a = function a() {};

const a = new AClass();

isInstanceOf<AClassInterface>(a, AClass); // resolves to true
```

ES5 classes work much better in plain JavaScript:

```js
function AClass() {}
AClass.prototype.a = function a() {};

const a = new AClass();

expect(isInstanceOf(a, AClass)).toBe(true);
```

## isInterfaceOf

```ts
isInterfaceOf: <T>(
  valueInput: unknown,
  tgInput: Record<string, (input: unknown) => boolean>,
) => valueInput is T

isInterfaceOfStrict: <T>(
  valueInput: unknown,
  tgInput: Record<string, (input: unknown) => boolean>,
) => valueInput is T
```

`isInterfaceOf` allows you to check objects in an ad-hoc fashion. You can check that an object conforms to a specific interface.

### Examples

```ts
interface Fun {
  a: string;
  b: number;
  c: boolean;
}

const goodInput = {
  a: 'a',
  b: 1,
  c: true,
};

const badInput = {
  a: 1,
  b: false,
  c: 'true',
};

isInterfaceOf<Fun>(goodInput, { a: isString, b: isNumber, c: isBoolean }); // resolves to true
isInterfaceOf<Fun>(badInput, { a: isString, b: isNumber, c: isBoolean }); // resolves to false
```

`isInterfaceOfStrict` allows you to check objects just like `isInterfaceOf`, but this function returns false if the input contains more keys than the interface should have.

### Examples

```ts
interface Fun {
  a: string;
  b: number;
  c: boolean;
}

const goodInput = {
  a: 'a',
  b: 1,
  c: true,
};

const badInput = {
  a: 'a',
  b: 1,
  c: true,
  d: 'extra',
};

isInterfaceOfStrict<Fun>(goodInput, { a: isString, b: isNumber, c: isBoolean }); // resolves to true
isInterfaceOfStrict<Fun>(badInput, { a: isString, b: isNumber, c: isBoolean }); // resolves to false
```

## isObjectOf

```ts
isObjectOf: <T>(
  input: unknown,
  typeGuard: (input: unknown) => input is T
): input is Record<string | number, T>
```

`isObjectOf` allows you to check that all values of an object conform to a specific type.

### Examples

```ts
const boolObj = {
  a: true,
  b: false,
  c: true,
};

const badObj = {
  a: 1,
  b: 'b',
  c: true,
};

isObjectOf<boolean>(boolObj, isBoolean); // resolves to true
isObjectOf<boolean>(badObj, isBoolean); // resolves to false

interface Fun {
  a: string;
  b: number;
}
const isFun = typeGuardGenerator<Fun>({
  a: isString,
  b: isNumber,
});

const obj = {
  a: { a: 'a', b: 1 },
  b: { a: 'b', b: 2 },
  c: { a: 'c', b: 3 },
};

isObjectOf<Fun>(obj, isFun); // resolves to true
```

## Promises

```ts
isPromise: (input: unknown) => input is Promise<unknown>
isPromiseFulfilled: (
  input: PromiseSettledResult<unknown>,
) => input is PromiseRejectedResult<unknown>
isPromiseRejected: (
  input: PromiseSettledResult<unknown>,
) => input is PromiseFulfilledResult<unknown>
```

The promise type guards test for types associated with promises.

- `isPromise` Checks whether the value is a `Promise` type
- `isPromiseFulfilled` Checks if an element from `Promise.allSettled` has resolved
- `isPromiseRejected` Checks if an element from `Promise.allSettled` errored or rejected

`isPromiseFulfilled` and `isPromiseRejected` are especially useful for checking whether returned values from `Promise.allSettled` resolved or rejected. These values can be difficult to resolve without a proper typeguard.

```ts
const results = await Promise.allSettled([getUsers(), getTransactions()]);

const resolvedPromises = results.filter(isPromiseFulfilled);
const rejectedPromises = results.filter(isPromiseRejected);

// Now, I can get all the resolved functions, extract data, etc.
// I can also find the functions that failed and display an error banner
```

## Arrays

```ts
isArray: (input: unknown) => input is unknown[]
isArrayOf: <T>(
  input: unknown,
  guard: (<T>(input: unknown) => input is T) | ((input: unknown) => boolean),
) => input is T[];
```

tcheck provides two functions for checking Arrays, `isArray` and `isArrayOf`. `isArray` allows you to check if a value is actually an array. This is useful over `Array.isArray`, because by default it sets the value's type to `any[]`, whereas `isArray` will set the value's type to `unknown[]`. This allows slightly more permissive configurations to lint your code and force you to check the contents of your array.

`isArrayOf` is a bit more specific. It checks if the contents of any array are of a specific type. This can be used with regular type guards as well as union type guards. This allows you to confirm that the Array is homogenous and of a specific type.

### Examples

```ts
const var1 = [];
const var2 = ['a', 'b', 'c'];
const var3 = ['a', 1, true];

isArray(var1); // Resolves to true
isArray(var2); // Resolves to true
isArray(var3); // Resolves to true

isArrayOf<number>(var1, isNumber); // Resolves to true
isArrayOf<number>(var2, isNumber); // Resolves to false
isArrayOf<string>(var2, isString); // Resolves to true
isArrayOf<number>(var3, isNumber); // Resolves to false
```

## Enums

```ts
interface PotentialEnum {
  [key: string]: number | string;
}

isEnumValue: <T extends PotentialEnum>(
  input: unknown,
  enumValue: T
) => input is T[keyof T]
```

Enums are a great way to constrain a value to a subset of strings or numbers. However, at the end of the day, TS enums are just objects of strings and numbers. One common action that is frequently taken is to receive a string value that should be part of an enum. `isEnumValue` is introduced to make it easy to confirm that a value is, in fact, a part of the enum.

### Example

```ts
enum Direction {
  Up = 'up';
  Down = 'down';
  Left = 'left';
  Right = 'right';
}

function goDirection(input: Direction) {
  // Do something
}

// This is a plain string and not a Direction type
const input = 'up';

// Discovers if input is a Direction and runs the function
// Should run, because value is equivalent to Direction.Up
if (isEnumValue(input, Direction)) {
  goDirection(input);
}
```

## Generators

```ts
typeGuardTestGenerator: (
  input: {
    [key: string]: ((input: unknown) => boolean) | ((input: unknown) => string[])
  }
) => (input: unknown) => string[]

typeGuardGenerator: <T>(
  tgInput: { [key: string]: TypeGuard<unknown> }
) => TypeGuard<T>

strictTypeGuardGenerator: <T>(
  typeGuard: TypeGuard<T>,
) => TypeGuard<Record<string | number, T>>

isObjectOfGenerator: <T>(
  typeGuard: TypeGuard<T>,
) => TypeGuard<Record<string | number, T>>

isInstanceOfGenerator: <T>(constructor: new (...args: never[]) => T) => TypeGuard<T>

isArrayOfGenerator: <T>(guard: (input: unknown) => input is T) => TypeGuard<T[]>

unionGuard: <T>(...guards: ((input: unknown) => boolean)[]) => TypeGuard<T>

isEnumValueGenerator: <T extends PotentialEnum>(enumValues: T) => (input: unknown) => input is T[keyof T]
```

The generators are where we get to the real power of this library. The generators allow us to create our own type guards for more complex data structures. Checking that a string is a string is trivial in the grand scheme of things, but checking that an object conforms to an interface can be a bit tedious. It gets more difficult the more we nest the data. We can offload this type checking to a generator to provide a simpler means to type guard with complex types.

This functionality is compatible with both TypeScript AND JavaScript.

tcheck provides several generators for generating different kinds of guards:

- `typeGuardTestGenerator` generates a new function that tests an object and returns an array of strings indicating what values are wrong within the object
- `typeGuardGenerator` generates a new function that checks that an object conforms to a specific structure
- `strictTypeGuardGenerator` generates a new function that checks that an object conforms to a specific structure. This function differs from `typeGuardGenerator` in that it will return false if the object contains extraneous keys that aren't part of the interface.
- `isObjectOfGenerator` generates a new function that checks if all the values of an object conform to a specific structure. Useful for objects where the key is a name, but not standardized.
- `isInstanceOfGenerator` generates a new function that checks if a value is an instance of a class.
- `isArrayOfGenerator` generates a new function that checks if an array contains values that conform to specific type guards
- `unionGuard` generates a new function that checks that a value conforms to one of several different guards. This is useful for union types, i.e. those that may be one of several types.
- `isEnumValueGenerator` generates a function that can test Enum values.

### Examples

`typeGuardTestGenerator` Generates a test for an object or interface. This function's main goal is debugging. It allows you to produce a list of faulty keys/values within an object. If the value provided is not an object, it returns an array with the string `root`. You should be able to use the length of this test to make sure that the value is valid.

```ts
interface Fun {
  a: string;
  b: number;
  c: boolean;
}

const funTest = typeGuardTestGenerator({
  a: isString,
  b: isNumber,
  c: isBoolean,
});

funTest({ a: 'a', b: 0, c: true }); // resolves to `[]`
funTest({ a: 'a', b: 0 }); // resolves to `['c']`
funTest('string'); // resolves to ['root']
```

`typeGuardTestGenerator` can be nested to provide you insights into deeply nested errors:

```ts
const innerTest = typeGuardTestGenerator({
  key: isString,
  value: isNumber,
});

const outerTest = typeGuardTestGenerator({
  key: isString,
  inner: innerTest,
});

const good = {
  key: 'hello',
  inner: { key: 'world', value: 1 },
};

const bad = {
  key: 'hello',
  inner: { key: 'world', value: '1' },
};

outerTest(good); // resolves to []
outerTest(bad); // resolves to ['inner.value']
```

`typeGuardGenerator` Generates a typeguard that takes the input as your test. The result of the function call is another function that can be used to type guard your interfaces.

```ts
interface Fun {
  a: string;
  b: number;
  c: boolean;
}

const funTest = typeGuardGenerator<Fun>({
  a: isString,
  b: isNumber,
  c: isBoolean,
});

funTest({ a: 'a', b: 0, c: true }); // resolves to true
funTest({ a: 'a', b: 0 }); // resolves to false
funTest('string'); // resolves to false
```

`strictTypeGuardGenerator` Generates a typeguard that takes the input as your test. Thre result of the function call is another function that can be used to type guard your interfaces. Objects that have extra keys will also resolve to false.

```ts
interface Fun {
  a: string;
  b: number;
  c: boolean;
}

const funTest = strictTypeGuardGenerator<Fun>({
  a: isString,
  b: isNumber,
  c: isBoolean,
});

funTest({ a: 'a', b: 0, c: true }); // resolves to true
funTest({ a: 'a', b: 0 }); // resolves to false
funTest({ a: 'a', b: 0, c: true, d: 'something' }); // resolves to false
funTest('string'); // resolves to false
```

Just like `typeGuardTestGenerator`, `typeGuardGenerator` can be nested:

```ts
const innerTest = typeGuardGenerator({
  key: isString,
  value: isNumber,
});

const outerTest = typeGuardGenerator({
  key: isString,
  inner: innerTest,
});

const good = {
  key: 'hello',
  inner: { key: 'world', value: 1 },
};

const bad = {
  key: 'hello',
  inner: { key: 'world', value: '1' },
};

outerTest(good); // resolves to true
outerTest(bad); // resolves to false
```

`isObjectOfGenerator` Generates a typeguard that takes the input as your test. The result of the function call is another function that can be used to type guard an object of indeterminate keys and specific values.

```ts
interface UserData {
  id: string;
  name: string;
  balance: number;
}
interface UserCollection {
  [key: string]: UserData;
}

const udGuard = typeGuardGenerator<UserData>({
  id: isString,
  name: isString,
  balance: isNumber,
});

const udObjGuard = isObjectOfGenerator<UserCollection>(udGuard);

const myObj = {
  katie: { id: '1', name: 'Katie', balance: 20 },
  jonathan: { id: '2', name: 'Jonathan', balance: 10 },
  franklin: { id: '3', name: 'Franklin', balance: 15 },
};

udObjGuard(myObj); // resolves to true
udObjGuard({}); // resolves to true
ubObjGuard({ katie: { id: '1', name: 'Katie' } }); // resolves to false
```

`isInstanceOfGenerator` generates a function that can be used to determine if a value is an instance of a class. This function will not resolve to true for objects that are similar to class instances

```ts
const isDate = isInstanceOfGenerator<Date>(Date);
isDate(new Date()); // resolves to true
isDate('2025-01-01'); // resolves to false

class AClass {
  a = 'a';
  b() { return 'b'; }
}
const isAClass<AClass>(AClass);

isAClass(new AClass()); // resolves to true
isAClass({ a: 'a', b: () => 'b' }); // resolves to false
```

`isArrayOfGenerator` generates a function that allows you to determine if all values conform to a typeguard. This can determine if the array is homogenous.

```ts
const isStrArr = isArrayOfGenerator<string>(isString); //  Tests for string arrays
const goodVal = ['a', 'b', 'c'];
const badVal = ['a', 'b', 1];
isStrArr(goodVal); // resolves to true
isStrArr(badVal); // resolves to false

class AClass {
  a() { return 'a'; }
}
const isAClass = isInstanceOfGenerator<AClass>(AClass);
const isAClassArr = isArrayOfGenerator<AClass>(isAClass);

const acArr = [
  new AClass(),
  new AClass(),
];

const badArr = [
  { a: () => 'a' }
  { a: () => 'a' }
  new AClass(),
];

isAClassArr(acArr); // resolves to true
isAClassArr(badArr); // resolves to false
```

`unionGuard` allows you to combine several type guards into a single function that type guards for TypeScript union types. This allows you to test for things like: "is String or undefined" or "is number or number array", etc. You can even combine union type guards.

```ts
const guard1 = unionGuard<string | undefined | null>(
  isString,
  isUndefined,
  isNull,
);
guard1('a'); // resolves to true
guard1(undefined); // resolves to true
guard1(null); // resolves to true
guard1(1); // resolves to false

const isNullOrUndefined = unionGuard<null | undefined>(isNull, isUndefined);
const isStringOrNullOrUndefined = unionGuard<string | null | undefined>(
  isString,
  isNullOrUndefined,
);

isNullOrUndefined(null); // Resolves to true
isNullOrUndefined(undefined); // Resolves to true
isNullOrUndefined(''); // Resolves to false

isStringOrNullOrUndefined(null); // Resolves to true
isStringOrNullOrUndefined(undefined); // Resolves to true
isStringOrNullOrUndefined(''); // Resolves to true
```

`isEnumValueGenerator` Allows you to create a function that tests if values are part of an enum, just like using `isEnumValue`.

```ts
enum Direction {
  Up = 'up';
  Down = 'down';
  Left = 'left';
  Right = 'right';
}

const isDirection = isEnumValueGenerator(Direction);

function goDirection(input: Direction) {
  // Do something
}

const value = 'up';

// Should run, because value is equivalent to Direction.Up
if (isDirection(value)) {
  goDirection(value);
}
```

## not

```ts
not: <T>(input: TypeGuard<T>) => (input: unknown) => input is Exclude<unknown, T>
```

Sometimes you want an opposite type guard. I.e. you may want to retrieve all values that DON'T conform to a specific type. The `not` function accepts a typeguard as an input and returns a new typeguard-like function that returns true if the input value is NOT the type in question.

### Examples

```ts
const myStr = 'hello, world';
const myNum = 12345;

const notString = not(isString);

isString(myStr); // Resolves to true, because myStr is a string
notString(myNum); // Resolves to true, because myNum is NOT a string
```

This can be used for filtering. Maybe you want to find all values that don't conform to a type for debugging purposes:

```ts
const mixedArray = [1, 'hello', true, null, 'world', undefined];
const notStrings = mixedArray.filter(not(isString));
```

You don't have to save the function if you're using it in a one-off situation:

```ts
const myNum = 12345;
const result = not(isString)(myNum);
```

It can be used with other typeguard functions in this project:

```ts
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
```

## separate

```ts
function separate<T>(
  typeguard: TypeGuard<T>,
): (val: unknown[]) => [T[], Exclude<unknown, T>[]];
```

separate accepts a typeguard and returns a function that separates values based upon the typeguard. I.e. it filters out all values that pass the typeguard into one array and everything else in another. It returns an array with the first value being all values of type `T` and the second value being all values that are NOT `T`.

Sometimes the show must go on and you'd like return values even if there's bad data. You can separate out values that actually conform and everything else gets sorted into a second array. If anything is in the second array, you have some bad data.

### Examples

```ts
import { isArray, separate } from '@metools/tcheck';
import { myCustomTypeguard } from './some/path';

const data = await fetch(url);
const rawJson = await data.json();

if (!isArray(rawJson)) {
  throw new Error('Invalid Response');
}

const customTGSeparator = separate(myCustomTypeGuard);

// Now we have an array
const [is, isNot] = customTGSeparator(rawJson);

if (isNot.length !== 0) {
  console.warn('Invalid data received from server');
}
```

## Use with JavaScript & JSDoc

Most of the examples above use TypeScript and its generic type variables. The generic type that's used in the function call provides information about the type guard and what type it's guarding against.

For instance, we might have a typeguard for an interface that we wish for our responses to conform to:

```ts
// API Response interface. Responses should conform to this structure
interface APIResponse {
  id: string;
  size: number;
  name: string;
}

// Generated type guard
const artg = typeGuardGenerator<APIResponse>({
  id: isString,
  size: isNumber,
  name: isString,
});
```

This works because typeGuardGenerator accepts a generic type variable (in this case, `APIResponse`) so that the function signature can determine what type the value actually is. If we omit the APIResponse type, the signature changes to `input is unknown`, which isn't terribly useful.

JavaScript has no such generic type variable and, as such, requires that you annotate the type in JSDoc. The above example would be translated to JavaScript like so:

```js
/**
 * @typedef {object} APIResponse
 * @property {string} id
 * @property {number} size
 * @property {string} name
 */

/** @type {(input: unknown) => input is APIResponse} */
const artg = typeGuardGenerator({
  id: isString,
  size: isNumber,
  name: isString,
});
```

A special `TypeGuard` generic type is provided in the package to simplify the type annotation of the function:

```js
/** @type {import('tcheck').TypeGuard<APIResponse>} */
const artg = typeGuardGenerator({
  id: isString,
  size: isNumber,
  name: isString,
});
```

Declaring a type in JS with JSDoc can be a little verbose, but can cut down on excessively verbose JSDoc typing using the `import` keyword. The below works with TypeScript & Eslint:

```js
/**
 * @typedef {import('./type').TypeGuard<T>} TypeGuard
 * @template T
 */

/** @type {TypeGuard<TestType>} */
const artg = typeGuardGenerator({
  id: isString,
  size: isNumber,
  name: isString,
});
```

I do recommend using ESLint with the [eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc) plugin and configured with `'flat/recommended-typescript'`. When you configure your project with this package, it enforces typing via JSDoc in JavaScript, making it directly compatible with Node without needing a transpile process immediately prior.
