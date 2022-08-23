import { CollectiveTypeSchema } from "./utils.ts";
import { Schema, UnwrapSchema } from "../types.ts";
import { DataFlow, toSchemaError } from "../utils.ts";
import { assertArray, assertObject } from "../asserts.ts";
import { SchemaError } from "../errors.ts";
import { Assert } from "../deps.ts";

/** Schema definition of built-in `Array`.
 *
 * ```ts
 * import { ArraySchema, assertSchema, StringSchema } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const value: unknown = undefined;
 * assertSchema(new ArraySchema(), value);
 * // value is `any[]`
 * assertSchema(new ArraySchema(new StringSchema()), value);
 * // value is `string[]`
 * ```
 */
export class ArraySchema<T extends Schema | undefined = undefined>
  extends CollectiveTypeSchema<
    unknown,
    T extends Schema ? UnwrapSchema<T>[] : any[]
  > {
  protected override assertion: (
    value: unknown,
  ) => asserts value is T extends Schema<unknown, unknown> ? UnwrapSchema<T>[]
    : any[];

  constructor(subType?: T) {
    super();

    if (subType) {
      this.assertion = new DataFlow(assertObject).define(assertArray).define(
        (value) => {
          for (const [index, v] of value.entries()) {
            try {
              subType.assert?.(v);
            } catch (e) {
              const error = toSchemaError(e);
              throw new SchemaError(`Invalid field. $[${index}]`, {
                children: [error],
              });
            }
          }
        },
      ).getAssert as Assert<
        unknown,
        T extends Schema ? UnwrapSchema<T>[] : any[]
      >;
    } else {
      this.assertion = new DataFlow(assertObject).define(
        assertArray,
      ).getAssert;
    }
  }
}
