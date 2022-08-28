import {
  InferSchema,
  Schema,
  SchemaParameter,
  SuperType,
  UnwrapSchema,
} from "../types.ts";
import { DataFlow, toSchema } from "../utils.ts";
import { assertAnd, assertNot, assertOr } from "../asserts.ts";
import { And, Assert } from "../deps.ts";

/** Schema definition of logical `OR`.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   NullSchema,
 *   NumberSchema,
 *   OrSchema,
 *   StringSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const schema = new OrSchema(
 *   new StringSchema(),
 *   new NumberSchema(),
 *   new NullSchema(),
 * );
 * const value: unknown = undefined;
 * assertSchema(schema, value);
 * // value is `string` | `number` | null
 * ```
 */
export class OrSchema<T extends unknown[]>
  implements Schema<unknown, UnwrapSchema<T[number]>> {
  #schemas: readonly unknown[];

  constructor(...schemas: T) {
    this.#schemas = schemas;
  }

  assert = new DataFlow().and(
    (value) => {
      const asserts = this.#schemas.map((schema) => toSchema(schema).assert);
      assertOr(asserts, value);
    },
  ).build() as Assert<unknown, UnwrapSchema<T[number]>>;
}

type SchemaPipeline<T extends readonly any[]> = T extends readonly [
  infer A extends Schema,
  infer _,
  ...infer Rest,
] ? readonly [
    A,
    ...SchemaPipeline<
      readonly [Schema<InferSchema<A>>, ...Rest]
    >,
  ]
  : T;

/** Schema definition of logical `AND`.
 *
 * ```ts
 * import {
 *   AndSchema,
 *   assertSchema,
 *   StringSchema,
 *   PartialSchema,
 *   ObjectSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const schema = new AndSchema(
 *   new ObjectSchema({
 *     type: new StringSchema()
 *   }),
 *   new PartialSchema({
 *     payload: new ObjectSchema()
 *   }),
 * );
 * assertSchema(schema, {});
 * ```
 */
export class AndSchema<
  T extends readonly Schema<any>[],
> implements Schema<SchemaParameter<T[0]>, And<UnwrapSchema<T>>> {
  #schemas: SchemaPipeline<T>;

  constructor(...schemas: SchemaPipeline<T>) {
    this.#schemas = schemas;
  }

  assert = new DataFlow().and(
    (value) => {
      const assertions = this.#schemas.map((schema) => schema.assert);
      assertAnd(assertions, value);
    },
  ).build() as Assert<SchemaParameter<T[0]>, And<UnwrapSchema<T>>>;
}

/** Schema definition of logical `NOT`.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   BooleanSchema,
 *   NotSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const value: unknown = undefined;
 * assertSchema(new NotSchema(new BooleanSchema()), value);
 * // value is `string` | `number` | ...
 * assertSchema(new NotSchema(true), value);
 * // value is `false` | `string` | `number` | ...
 * ```
 */
export class NotSchema<T>
  implements Schema<unknown, Exclude<SuperType, UnwrapSchema<T>>> {
  assert: (
    value: unknown,
  ) => asserts value is Exclude<SuperType, UnwrapSchema<T>> = (value) => {
    assertNot(toSchema(this.value).assert, value);
  };

  constructor(private value: T) {}
}
