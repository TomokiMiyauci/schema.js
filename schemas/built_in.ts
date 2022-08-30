import { AssertiveSchema, CollectiveTypeSchema } from "./utils.ts";
import { toSchema } from "../utils.ts";
import { Schema, UnwrapSchema } from "../types.ts";
import { assertPartialProperty } from "../asserts.ts";
import { isSchema } from "../validates.ts";
import { assertExistsPropertyOf } from "../deps.ts";

/** Schema of optional properties.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   FunctionSchema,
 *   PartialSchema,
 *   StringSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const abilitySchema = new PartialSchema({
 *   fly: new FunctionSchema(),
 * });
 * const model = { type: "bird" } as const;
 * assertSchema(abilitySchema, model);
 * // { type: "bird", fly?: Function }
 * ```
 */
export class PartialSchema<T>
  extends CollectiveTypeSchema<unknown, Partial<UnwrapSchema<T>>> {
  constructor(private record: T) {
    super();
  }

  protected override create = () => new PartialSchema(this.record);

  protected override assertion: (
    value: unknown,
  ) => asserts value is Partial<UnwrapSchema<T>> = (value) =>
    assertPartialProperty(this.record, value);
}

/** Schema of `Record` object.
 *
 * ```ts
 * import {
 *   NumberSchema,
 *   RecordSchema,
 *   StringSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const schema = new RecordSchema(new StringSchema(), new NumberSchema());
 * // Record<string, number>
 * ```
 */
export class RecordSchema<
  K extends string | symbol | Schema<unknown, string | symbol>,
  V,
> extends CollectiveTypeSchema<
  Record<PropertyKey, unknown>,
  Record<UnwrapSchema<K>, UnwrapSchema<V>>
> {
  constructor(private key: K, private value: V) {
    super();
  }
  protected override assertion: (
    value: Record<PropertyKey, unknown>,
  ) => asserts value is Record<UnwrapSchema<K>, UnwrapSchema<V>> = (
    value,
  ) => {
    if (!isSchema(this.key)) {
      assertExistsPropertyOf(this.key, value);
    }

    const keySchema = toSchema(this.key);
    const valueSchema = toSchema(this.value);
    const objective = Object(value);

    for (const k in value) {
      keySchema.assert?.(k);
      valueSchema.assert?.(objective[k]);
    }
  };

  protected override create = () => new RecordSchema(this.key, this.value);
}

/** Schema of `unknown`. This is the Top type.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   RecordSchema,
 *   StringSchema,
 *   UnknownSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const schema = new RecordSchema(new StringSchema(), new UnknownSchema());
 * // schema for `Record<string, unknown>`
 * ```
 */
export class UnknownSchema extends AssertiveSchema {
  protected override assertion: (value: unknown) => asserts value is unknown =
    () => {};
}
