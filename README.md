# schema.js

Universal, tiny schema for JavaScript data types.

## Define schema

Create JavaScript primitive data schema.

```ts
import {
  BigintSchema,
  BooleanSchema,
  NullSchema,
  NumberSchema,
  StringSchema,
  SymbolSchema,
  UndefinedSchema,
} from "https://deno.land/x/schema_js/mod.ts";

const stringSchema = new StringSchema();
const numberSchema = new NumberSchema();
const bigintSchema = new BigintSchema();
const booleanSchema = new BooleanSchema();
const nullSchema = new NullSchema();
const undefinedSchema = new UndefinedSchema();
const symbolSchema = new SymbolSchema();
```

Create JavaScript objective data schema.

```ts
import {
  FunctionSchema,
  ObjectSchema,
} from "https://deno.land/x/schema_js/mod.ts";

const objectSchema = new ObjectSchema();
const functionSchema = new FunctionSchema();
```

## Logical operation schema

Provides the logical operations of the schema. Several schemas can be multiplied
together to create a new schema.

```ts
import {
  NumberSchema,
  OrSchema,
  StringSchema,
} from "https://deno.land/x/schema_js/mod.ts";

const stringOrNumberSchema = new OrSchema(
  new StringSchema(),
  new NumberSchema(),
);
```

## Assert schema

Assert whether the value satisfies the schema.

```ts
import {
  assertSchema,
  BooleanSchema,
} from "https://deno.land/x/schema_js/mod.ts";

const value: unknown = true;
assertSchema(new BooleanSchema(), value);
// value is `boolean`
assertSchema(new BooleanSchema(true), value);
// value is `true`
assertSchema(new BooleanSchema(false), value); // throws AggregateError
```

## Built-in Objects

- Array -> `ArraySchema`

```ts
import {
  ArraySchema,
  StringSchema,
} from "https://deno.land/x/schema_js/mod.ts";

const value: unknown = undefined;
assertSchema(new ArraySchema(), value);
// value is `any[]`
assertSchema(new ArraySchema(new StringSchema()), value);
// value is `string[]`
```
