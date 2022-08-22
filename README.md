# schema.js

Universal, tiny schema for JavaScript data types.

## Core schema

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
} from "https://deno.land/x/schema_js/mod.ts";

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
} from "https://deno.land/x/schema_js/mod.ts";

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
} from "https://deno.land/x/schema_js/mod.ts";

const value: unknown = undefined;
assertSchema(new NotSchema(new BooleanSchema()), value);
// value is `string` | `number` | ...
assertSchema(new NotSchema(new BooleanSchema(true)), value);
// value is `false` | `string` | `number` | ...
```

## Built-in Objects schema

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
