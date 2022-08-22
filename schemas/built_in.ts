import { Unwrap } from "./types.ts";
import { AssertSchema } from "./utils.ts";
import { Schema } from "../types.ts";
import { DataFlow } from "../utils.ts";
import { assertArray, assertObject } from "../asserts.ts";
import { isFailResult } from "../type_guards.ts";
import { SchemaError } from "../errors.ts";

/** Schema definition of built-in `Array`.
 *
 * ```ts
 * import { ArraySchema } from "https://deno.land/x/schema_js/mod.ts";
 *
 * const value: unknown = undefined;
 * assertSchema(new ArraySchema(), value);
 * // value is `any[]`
 * assertSchema(new ArraySchema(new StringSchema()), value);
 * // value is `string[]`
 * ```
 */
export class ArraySchema<T extends Schema | undefined = undefined>
  extends AssertSchema<T extends Schema ? Unwrap<T[]> : any[]> {
  constructor(subType?: T) {
    super();

    if (subType) {
      this.assert = new DataFlow(assertObject).define(assertArray).define(
        (value) => {
          for (const [index, v] of value.entries()) {
            const result = subType.validate(v);

            if (isFailResult(result)) {
              throw new SchemaError(`Invalid field. $[${index}]`, {
                children: result.errors,
              });
            }
          }
        },
      ).getAssert;
    }
  }

  override assert = new DataFlow(assertObject).define(
    assertArray,
  ).getAssert;
}
