import { SchemaError } from "./errors.ts";
import { ReturnAssert, valueOf } from "./deps.ts";
import { Assertion } from "./deps.ts";

export interface ScalerTypeMap {
  string: string;
  number: number;
  bigint: bigint;
  null: null;
  undefined: undefined;
  boolean: boolean;
  symbol: symbol;
}

export type Primitive = valueOf<ScalerTypeMap>;

export interface ObjectTypeMap {
  object: object;
  function: Function;
}

export interface SuperTypeMap extends ScalerTypeMap, ObjectTypeMap {}

export type SuperType = valueOf<SuperTypeMap>;

export type TypeStr = keyof SuperTypeMap;

/** Schema specification. */

export interface Schema<In = unknown, Out extends In = In> {
  /** Assert the {@link In input} is {@link Out output}. */
  assert: (value: In) => asserts value is Out;
}

export type Result<T = unknown> =
  | SuccessResult<T>
  | FailResult;

export type SuccessResult<T = unknown> = {
  data: T;
};

export type FailResult = {
  errors: SchemaError[];
};

/** Utility for unwrap schema.
 *
 * ```ts
 * import { UnwrapSchema, StringSchema, ObjectSchema } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * const stringSchema = new StringSchema("world");
 * type a = UnwrapSchema<typeof stringSchema>; // "world"
 * const objectSchema = new Object({
 *  hello: stringSchema
 * })
 * type b = UnwrapSchema<typeof objectSchema>; // { hello: "world" }
 * ```
 */
export type UnwrapSchema<
  S,
> = S extends Schema ? UnwrapSchema<ReturnAssert<S["assert"]>> : {
  [k in keyof S]: S[k] extends Schema
    ? UnwrapSchema<ReturnAssert<S[k]["assert"]>>
    : S[k];
};

/** Type inference of TypeScript data types from the schema.
 *
 * ```ts
 * import {
 *   ArraySchema,
 *   InferSchema,
 *   NumberSchema,
 *   ObjectSchema,
 *   StringSchema,
 *   TupleSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const schema = new ObjectSchema({
 *   a: new StringSchema(),
 *   b: new ArraySchema().and(
 *     new TupleSchema(new StringSchema("hello"), new NumberSchema()),
 *   ),
 *   c: new ObjectSchema({
 *     d: new NumberSchema(0),
 *   }),
 * });
 *
 * type Schema = InferSchema<typeof schema>;
 * ```
 */
export type InferSchema<S extends Schema> = Assertion<S["assert"]>;
