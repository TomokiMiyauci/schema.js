<div align="center">

# typestruct

<img alt="logo icon" src="./_medias/logo.png" width="180px" height="180px">

Composable and checkable JavaScript(and TypeScript) data structure.

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/schema_js)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/schema_js/mod.ts)
[![codecov](https://codecov.io/gh/schemaland/schema.js/branch/beta/graph/badge.svg?token=nHsoT44zg6)](https://codecov.io/gh/schemaland/schema.js)

</div>

## Basic usage

```ts
import { assert, number, object, string } from "https://deno.land/x/struct";

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
import { assertEquals } from "[https://](https://deno.land/std@$VERSION/testing/asserts/mod.ts)";

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
import { assertThrows } from "[https://](https://deno.land/std@$VERSION/testing/asserts/mod.ts)";

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
import { assertEquals } from "[https://](https://deno.land/std@$VERSION/testing/asserts/mod.ts)";

const Product = object({
  price: number(),
});
assertEquals(validate(Product, { price: 100 }), {
  valid: true,
  data: { price: 100 },
});
```

### Sub Struct

Sub struct refers to a struct whose input type is other than Top-type.

#### maxSize

Create max size struct. Sets the maximum number of elements.

```ts
import { is, maxSize } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";

assertEquals(is(maxSize(10), "typestruct"), true);
assertEquals(is(maxSize(4), new Array(5)), false);
```

#### minSize

Create min size struct. Sets the minimum number of elements.

```ts
import { is, minSize } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";

assertEquals(is(minSize(10), "typestruct"), true);
assertEquals(is(minSize(10), new Array(5)), false);
```

#### empty

Create empty struct. Empty means there are no elements.

```ts
import { empty, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";

assertEquals(is(empty(), ""), true);
assertEquals(is(empty(), [1]), false);
```

#### nonempty

Create non empty struct. Non empty meas there are more than one element.

```ts
import { is, nonempty } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";

assertEquals(is(nonempty(), new Set([1, 2, 3])), true);
assertEquals(is(nonempty(), new Map(), false);
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
import { Struct } from "https://deno.land/x/typestruct/mod.ts";
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
import { maxSize } from "https://deno.land/x/typestruct/mod.ts";
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
} from "https://deno.land/x/typestruct/mod.ts";

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
[deno doc](https://doc.deno.land/https/deno.land/x/schema_js/mod.ts).

## Performance

Benchmark script with comparison to several popular schema library is available.

```bash
deno bench --unstable
```

You can check the
[benchmark](https://github.com/schemaland/schema.js/runs/7979671007?check_suite_focus=true#step:4:26).

## License

Copyright © 2022-present [schemaland](https://github.com/schemaland).

Released under the [MIT](./LICENSE) license
