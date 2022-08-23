# schema.js

<div align="center">
<img alt="logo icon" src="./_medias/logo.png" width="180px" height="180px">

Universal, tiny schema for JavaScript data types.

</div>

## Design

For this project, we will define the schema based on JavaScript data types.

JavaScript can be classified into two data types called primitives and objects.

If we further classify them according to whether they are Unit type or
Collective types, they can be classified into 8 data types.

Unit type is a type that has only a single value. Collection type is set of Unit
type.

|           | Unit type   | Collective type                                   |
| --------- | ----------- | ------------------------------------------------- |
| Primitive | `undefined` | `string`, `number`, `bigint`, `boolean`, `symbol` |
| Object    | `null`      | `object`                                          |

A subtype of `object`, `Function` is a special type that JavaScript treats as
first class.

So for this project, we define `Function` as a supertype in addition to the 8
types above.

## Core schema

Create JavaScript primitive data schema.

```ts
import {
  BigintSchema,
  BooleanSchema,
  NumberSchema,
  StringSchema,
  SymbolSchema,
  UndefinedSchema,
} from "https://deno.land/x/schema_js@$VERSION/mod.ts";

const stringSchema = new StringSchema();
const numberSchema = new NumberSchema();
const bigintSchema = new BigintSchema();
const booleanSchema = new BooleanSchema();
const undefinedSchema = new UndefinedSchema();
const symbolSchema = new SymbolSchema();
```

Create JavaScript objective data schema.

```ts
import {
  FunctionSchema,
  NullSchema,
  ObjectSchema,
} from "https://deno.land/x/schema_js@$VERSION/mod.ts";

const objectSchema = new ObjectSchema();
const functionSchema = new FunctionSchema();
const nullSchema = new NullSchema();
```

## Assert schema

Assert whether the value satisfies the schema.

```ts
import {
  assertSchema,
  BooleanSchema,
} from "https://deno.land/x/schema_js@$VERSION/mod.ts";

const value: unknown = true;
assertSchema(new BooleanSchema(), value);
// value is `boolean`
assertSchema(new BooleanSchema(true), value);
// value is `true`
assertSchema(new BooleanSchema(false), value); // throws AggregateError
```

## Additional subtype assertion (narrowing)

For the Collective type, you can add assertions of subtypes.

The Collective type has the `and` method. It adds assertion of the subtype and
returns a new Collective type. The new Collective type will be type narrowed by
the added assertion.

Example of creating a string array(`string[]`) schema from an object schema:

```ts
import {
  assertArray,
  assertSchema,
  ObjectSchema,
  SchemaError,
} from "https://deno.land/x/schema_js@$VERSION/mod.ts";

const value: unknown = undefined;

const arraySchema = new ObjectSchema().and(assertArray);
assertSchema(arraySchema, value);
// value is `any[]`

function assertStringArray(
  value: ReadonlyArray<any>,
): asserts value is string[] {
  value.forEach((v) => {
    const type = typeof v;
    if (type !== "string") {
      throw new SchemaError(`Invalid member. "string" <- ${type}`);
    }
  });
}
const stringArraySchema = arraySchema.and(assertStringArray);
assertSchema(stringArraySchema, value);
// value is `string[]`
```

## Logical operation schema

Provides the logical operations of the schema. Several schemas can be multiplied
together to create a new schema.

### Logical OR

The logical OR schema (logical disjunction) for a set of schemas is true if and
only if one or more of its schemas is true.

Type inference works correctly.

```ts
import {
  assertSchema,
  NullSchema,
  NumberSchema,
  OrSchema,
  StringSchema,
} from "https://deno.land/x/schema_js@$VERSION/mod.ts";

const schema = new OrSchema(
  new StringSchema(),
  new NumberSchema(),
  new NullSchema(),
);
const value: unknown = undefined;
assertSchema(schema, value);
// value is `string` | `number` | null
```

### Logical AND

The logical AND schema (logical conjunction) for a set of schemas will be true
if and only if all the schemas are true. Otherwise it will be false.

Type inference works correctly.

```ts
import {
  AndSchema,
  assertSchema,
  OrSchema,
  StringSchema,
} from "https://deno.land/x/schema_js@$VERSION/mod.ts";

const schema = new AndSchema(
  new StringSchema("hello"),
  new StringSchema(),
);
const value: unknown = undefined;
assertSchema(schema, value);
// value is `"hello"`
```

### Logical NOT

The logical NOT schema (logical complement, negation) takes valid schema to
invalid and vice versa.

Type inference works correctly.

```ts
import {
  assertSchema,
  BooleanSchema,
  NotSchema,
} from "https://deno.land/x/schema_js@$VERSION/mod.ts";

const value: unknown = undefined;
assertSchema(new NotSchema(new BooleanSchema()), value);
// value is `string` | `number` | ...
assertSchema(new NotSchema(new BooleanSchema(true)), value);
// value is `false` | `string` | `number` | ...
```

## String subtype schema

Provides schema for string subtypes.

```ts
import {
  assertSchema,
  LengthSchema,
  MaxLengthSchema,
  MinLengthSchema,
} from "https://deno.land/x/schema_js@$VERSION/mod.ts";

const maxLengthSchema = new MaxLengthSchema(255);
const minLengthSchema = new MinLengthSchema(10);
const lengthSchema = new LengthSchema(20);

const value: string = "This is string subtype type.";
assertSchema(maxLengthSchema, value);
assertSchema(minLengthSchema, value);
assertSchema(lengthSchema, value); // throw SchemaError
```

## Built-in Objects schema

- Array -> `ArraySchema`

```ts
import {
  ArraySchema,
  assertSchema,
  StringSchema,
} from "https://deno.land/x/schema_js@$VERSION/mod.ts";

const value: unknown = undefined;
assertSchema(new ArraySchema(), value);
// value is `any[]`
assertSchema(new ArraySchema(new StringSchema()), value);
// value is `string[]`
```

### Tuple schema

It is a sub-type of the `Array` object and represents an array of a finite
number of elements.

```ts
import {
  ArraySchema,
  assertSchema,
  NumberSchema,
  StringSchema,
  TupleSchema,
  UndefinedSchema,
} from "https://deno.land/x/schema_js@$VERSION/mod.ts";

const value: any[] = [];
const tupleSchema = new TupleSchema(
  new NumberSchema(),
  new StringSchema("hello"),
  new UndefinedSchema(),
);
assertSchema(tupleSchema, value);
// value is [number, "hello", undefined]

const arraySchema = new ArraySchema().and(tupleSchema);
const unknown: unknown = null;
assertSchema(arraySchema, unknown);
// value is [number, "hello", undefined]
```

## License

Copyright © 2022-present [schemaland](https://github.com/schemaland).

Released under the [MIT](./LICENSE) license
