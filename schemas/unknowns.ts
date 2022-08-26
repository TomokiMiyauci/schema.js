import { CollectiveTypeSchema } from "./utils.ts";
import { UnwrapSchema } from "../types.ts";
import { assertPartialProperty } from "../asserts.ts";

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
