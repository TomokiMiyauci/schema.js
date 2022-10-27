# typestruct

Composable and checkable JavaScript (and TypeScript) data structure.

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/typestruct)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/typestruct/mod.ts)

## Basic usage

```ts
import {
  assert,
  number,
  object,
  string,
} from "https://deno.land/x/typestruct@$VERSION/mod.ts";

const Product = object({
  id: string(),
  name: string(),
  price: number(),
  category: object({
    id: string(),
    name: string(),
  }),
});
declare const data: unknown;

assert(Product, data);
```

The `data` is infer as follows:

```ts
interface data {
  id: string;
  name: string;
  price: number;
  category: {
    id: string;
    name: string;
  };
}
```

`assert` throws an error if the data does not match the struct and reports
issues.

Other functions such as `is` and the `validate` function can also be used.

## Check functions

Check function is a runner that takes a Struct (strictly `Cheakable`) and input
and checks it.

The following check functions differ in the way they express their results.

### is

Whether the input satisfies struct or not. With type guard, inputs are type
inferred.

This is best used if you are only interested in whether or not the struct is
satisfied.

```ts
import { is, string } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(string(), "any input"), true);
assertEquals(is(string(), {}), false);
```

### assert

Assert whether the input satisfies the struct.With assert signature, inputs are
type inferred.

If Struct is not satisfied, a `StructError` will be thrown.

If you want to stop execution, it is best to use this.

```ts
import {
  assert,
  maxSize,
  minSize,
  StructError,
} from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertThrows } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertThrows(() => assert(maxSize(5), "typestruct"), StructError);
```

### validate

Returns the checking result. If input satisfies struct, the `valid` field is
`true` and returns an object with type-inferred `data`. Otherwise, the `valid`
field is `false` and returns an object containing the `errors` field.

Use this if you want to control the check results.

```ts
import {
  number,
  object,
  validate,
} from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

const Product = object({
  price: number(),
});
assertEquals(validate(Product, { price: 100 }), {
  valid: true,
  data: { price: 100 },
});
```

### Struct factory

Central to the definition of Struct is the use of struct factories.

The standard struct factory makes it easy to create a basic Struct that checks
for standard types and values.

For example, the `maxSize` returns `Struct<Iterable<unknown>>`. This guarantees
an upper bound on the number of elements in the input.

```ts
import { maxSize } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
const Max10 = maxSize(10);
```

### Core Struct factories

#### string

Create `string` data type struct.

```ts
import { is, string } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(string(), ""), true);
assertEquals(is(string(), 0), false);
```

#### number

Create `number` data type struct.

```ts
import { is, number } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(number(), 0), true);
assertEquals(is(number(), ""), false);
```

#### bigint

Create `bigint` data type struct.

```ts
import { bigint, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(bigint(), 0), true);
assertEquals(is(bigint(), 0n), false);
```

#### boolean

Create `boolean` data type struct.

```ts
import { boolean, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(boolean(), true), true);
assertEquals(is(boolean(), ""), false);
```

#### func

Create `function` data type struct.

```ts
import { func, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(func(), () => {}), true);
assertEquals(is(func(), {}), false);
```

#### symbol

Create `symbol` data type struct.

```ts
import { is, symbol } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(symbol(), Symbol.iterator), true);
assertEquals(is(symbol(), {}), false);
```

#### value

Create primitive value struct.

```ts
import { is, value } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(value(null), null), true);
assertEquals(is(value(null), undefined), false);
```

#### object

Create `object` data type struct. Treat `null` as not an `object`.

```ts
import { is, object } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(object(), {}), true);
assertEquals(is(object(), null), false);
```

Create object literal struct. Additional properties will ignore.

```ts
import {
  is,
  object,
  string,
} from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

const Book = object({
  title: string(),
  postBy: object({
    name: string(),
  }),
});

assertEquals(
  is(Book, {
    title: "Diary of Anne Frank",
    postBy: { name: "Anne Frank" },
  }),
  true,
);
```

#### record

Create `Record` struct. Ensure the input is object, and keys and values satisfy
struct.

```ts
import {
  is,
  number,
  record,
  string,
} from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

const Record = record(string(), number()); // { [k: string]: number }
assertEquals(is(Record, { john: 80, tom: 100 }), true);
assertEquals(is(Record, { name: "john", hobby: "swimming" }), false);
```

#### array

Create `any[]` data type struct.

```ts
import { array, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(array(), []), true);
assertEquals(is(array(), {}), false);
```

#### instance

Create `instanceof` struct. Ensure that the input is an instance of a defined
constructor.

```ts
import { instance, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(instance(Array), []), true);
assertEquals(is(instance(class Any {}), null), false);
```

#### pick

Create `Pick` struct. From struct, pick a set of properties whose keys are in
the definition.

```ts
import {
  is,
  object,
  pick,
  string,
} from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

const User = object({ id: string(), name: string() });
const data = { name: "tom" };

assertEquals(is(User, data), false);
assertEquals(is(pick(User, ["name"]), data), true);
```

#### omit

Create `Omit` struct. From struct, omit a set of properties whose keys are in
the definition.

```ts
import {
  is,
  object,
  omit,
  string,
} from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

const User = object({ id: string(), name: string() });
const data = { name: "tom" };

assertEquals(is(User, data), false);
assertEquals(is(omit(User, ["id"]), data), true);
```

#### partial

Create `Partial` struct. Make all properties in struct optional.

```ts
import {
  is,
  object,
  partial,
  string,
} from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

const User = object({ id: string(), name: string() });

assertEquals(is(User, {}), false);
assertEquals(is(partial(User), {}), true);
```

### Operator Struct

Logical operations for Struct.

#### and

Create intersection struct. Ensure all structures satisfy.

The first `Struct::In` and the last `Struct::Out` create a new
`Struct<In, Out>`.

Strong type-narrowing safely joins intermediate struct.

```ts
import {
  and,
  is,
  maxSize,
  minSize,
  string,
} from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

const String5_10 = and(string()).and(minSize(5)).and(maxSize(10));

assertEquals(is(String5_10, "typestruct"), true);
assertEquals(is(String5_10, ""), false);
```

#### or

Create union struct. Ensure any of struct satisfy.

The first `Struct::In` and all `Struct::Out` create a new `Struct<In, Out>`

```ts
import {
  is,
  number,
  or,
  string,
} from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

const StrOrNum = or(string()).or(number());
assertEquals(is(StrOrNum, ""), true);
assertEquals(is(StrOrNum, 0), true);
assertEquals(is(StrOrNum, {}), false);
```

#### not

Create Inversion struct. Ensure the structure is not satisfied.

```ts
import {
  is,
  not,
  string,
} from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

const NotString = not(string());
assertEquals(is(NotString, 0), true);
assertEquals(is(NotString, "typestruct"), false);
```

### Sub Struct

Sub struct refers to a struct whose input type is other than Top-type.

#### maximum

Create maximum struct. Ensure the input less than or equal to threshold.

```ts
import { is, maximum } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(maximum(5), 5), true);
assertEquals(is(maximum(5), 6), false);
```

Any type can be defined as a threshold. Internally, they are compared by
comparison operators.

```ts
import { is, maximum } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(
  is(maximum(new Date("2022-12-31")), new Date("2023-01-01")),
  false,
);
```

#### minimum

Create minimum struct. Ensure the input grater than or equal to threshold.

```ts
import { is, minimum } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(minimum(5), 5), true);
assertEquals(is(minimum(5), 4), false);
```

Any type can be defined as a threshold. Internally, they are compared by
comparison operators.

```ts
import { is, minimum } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(
  is(minimum(new Date("2000-01-01")), new Date("1999-12-31")),
  false,
);
```

#### maxSize

Create max size struct. Sets the maximum number of elements.

```ts
import { is, maxSize } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(maxSize(10), "typestruct"), true);
assertEquals(is(maxSize(4), new Array(5)), false);
```

#### minSize

Create min size struct. Sets the minimum number of elements.

```ts
import { is, minSize } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(minSize(10), "typestruct"), true);
assertEquals(is(minSize(10), new Array(5)), false);
```

#### size

Create size struct. Ensure the number of elements.

```ts
import { is, size } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(size(10), "typestruct"), true);
assertEquals(is(size(1), new Set()), false);
```

#### empty

Create empty struct. Empty means there are no elements.

```ts
import { empty, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(empty(), ""), true);
assertEquals(is(empty(), [1]), false);
```

#### nonempty

Create non empty struct. Non empty meas there are more than one element.

```ts
import { is, nonempty } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(nonempty(), new Set([1, 2, 3])), true);
assertEquals(is(nonempty(), new Map()), false);
```

#### pattern

Create pattern struct. Ensure the input match to the pattern.

```ts
import { is, pattern } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(pattern(/type/), "typescript"), true);
assertEquals(is(pattern(/type/), "javascript"), false);
```

#### list

Create list struct. List is array subtype. Ensure that all elements are same
type.

```ts
import {
  and,
  array,
  is,
  list,
  number,
  string,
} from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(list(string()), ["typescript", "javascript"]), true);
assertEquals(is(and(array()).and(list(number())), [1, 2, 3]), true);
```

#### tuple

Create tuple struct. Tuple is array subtype. Ensure that the position and type
of the elements match.

```ts
import {
  and,
  array,
  is,
  number,
  object,
  string,
  tuple,
} from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

const Tuple = tuple([string(), number(), object()]);

assertEquals(is(Tuple, ["", 0, {}]), true);
assertEquals(is(and(array()).and(Tuple), [1, 2, 3] as unknown), true);
```

### int

Create integer struct. Ensure the input is integer.

```ts
import { int, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(int(), 1.0), true);
assertEquals(is(int(), 1.1), false);
```

### validDate

Create valid date struct. Ensure the input is valid date (non `NaN`) format.

```ts
import { is, validDate } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

assertEquals(is(validDate(), new Date("2022-01-01")), true);
assertEquals(is(validDate(), new Date("invalid date")), false);
```

## Struct deep dive

The essence of struct is to guarantee types and values. And you probably do
validation for the same reason.

Struct is an interface with `In` and `Out` generics.

```ts
interface Struct<In, Out extends In = any> {}
```

`In` represents the accepted data types. It can be any type, including the top
types `unknown` and `string`.

`Out` represents the guaranteed data type. It indicates the type of the result
of narrowing the data.

### Type Guarantee

Now let's look at the `string` factory.

```ts
import { string } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
const String = string(); // Struct<unknown, string>
```

Another example is `Struct<{}, { length: number }>`, which accepts Non-nullable
data types and guarantees that the data has the `length` property.

Depending on the data type of `In`, there are **constraints** on the inputs that
can be passed to the check function.

### Value Guarantee

If there is no type narrowing, nothing needs to be specified for `Out`. This
implies that it is a value-checking struct.

```ts
import { maxSize } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
const MaxSize = maxSize(5); // Struct<Iterable<unknown>>
```

This indicates that the `Iterable<unknown>` type is accepted and no type
narrowing.

### Composable struct

Struct should be singly liable. Struct should have a single responsibility
because things that do one thing can be composited together.

Struct and Composition

Struct should be singly liable. Structs that do one thing can be efficiently
synthesized with each other.

We provide `and` and `or` as structs that compose.

For example, suppose you want to guarantee that the input is a string, and that
it has between 10 and 100 characters.

Combine the `and` and `string`, `maxSize` and `minSize` modules to create a new
struct.

```ts
import {
  and,
  maxSize,
  minSize,
  string,
} from "https://deno.land/x/typestruct@$VERSION/mod.ts";

const MinSize10 = minSize(10);
const MaxSize100 = maxSize(100);
const String = string();
const String10To100 = and(String).and(MinSize10).and(MaxSize100);
```

Here's what's happening with `and`.

String is `Struct<unknown, string>`. When `and` accepts String, it narrows down
the next acceptable type; `string`, the `Out` of String. That is,
`Struct<string, string>`.

MinSize10 is `Struct<Iterable<unknown>>`. `Iterable<unknown>` is accepted
because it is compatible with `string`. Since `Out` is omitted (`any`), no
narrowing is done. The same goes for MaxSize100.

In this way, you can compose type-safe.

## API

All APIs can be found in the
[deno doc](https://doc.deno.land/https/deno.land/x/typestruct/mod.ts).

## Bundle size

The bundle size adapted to tree-shaking with ESbuild is as follows:

<!-- start-bundle-size -->

| Module                      | Size                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| *                           | ![*](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts)                                       |
| [StructError](#StructError) | ![StructError](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7BStructError%7D) |
| [and](#and)                 | ![and](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Band%7D)                 |
| [array](#array)             | ![array](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Barray%7D)             |
| [assert](#assert)           | ![assert](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bassert%7D)           |
| [bigint](#bigint)           | ![bigint](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bbigint%7D)           |
| [boolean](#boolean)         | ![boolean](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bboolean%7D)         |
| [empty](#empty)             | ![empty](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bempty%7D)             |
| [func](#func)               | ![func](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bfunc%7D)               |
| [instance](#instance)       | ![instance](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Binstance%7D)       |
| [int](#int)                 | ![int](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bint%7D)                 |
| [is](#is)                   | ![is](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bis%7D)                   |
| [list](#list)               | ![list](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Blist%7D)               |
| [maxSize](#maxSize)         | ![maxSize](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7BmaxSize%7D)         |
| [maximum](#maximum)         | ![maximum](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bmaximum%7D)         |
| [minSize](#minSize)         | ![minSize](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7BminSize%7D)         |
| [minimum](#minimum)         | ![minimum](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bminimum%7D)         |
| [nonempty](#nonempty)       | ![nonempty](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bnonempty%7D)       |
| [not](#not)                 | ![not](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bnot%7D)                 |
| [number](#number)           | ![number](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bnumber%7D)           |
| [object](#object)           | ![object](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bobject%7D)           |
| [omit](#omit)               | ![omit](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bomit%7D)               |
| [or](#or)                   | ![or](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bor%7D)                   |
| [partial](#partial)         | ![partial](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bpartial%7D)         |
| [pattern](#pattern)         | ![pattern](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bpattern%7D)         |
| [pick](#pick)               | ![pick](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bpick%7D)               |
| [record](#record)           | ![record](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Brecord%7D)           |
| [size](#size)               | ![size](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bsize%7D)               |
| [string](#string)           | ![string](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bstring%7D)           |
| [symbol](#symbol)           | ![symbol](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bsymbol%7D)           |
| [tuple](#tuple)             | ![tuple](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Btuple%7D)             |
| [validDate](#validDate)     | ![validDate](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7BvalidDate%7D)     |
| [validate](#validate)       | ![validate](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bvalidate%7D)       |
| [value](#value)             | ![value](https://bundlejs.com/api/badge?q=https%3A%2F%2Fdeno.land%2Fx%2Ftypestruct%2Fmod.ts&treeshake=%7Bvalue%7D)             |

<!-- end-bundle-size -->

## License

Copyright © 2022-present [Tomoki Miyauchi](https://github.com/TomkiMiyauci).

Released under the [MIT](./LICENSE) license
