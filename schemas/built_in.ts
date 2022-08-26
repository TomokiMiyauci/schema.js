import { CollectiveTypeSchema } from "./utils.ts";
import { UnwrapSchema } from "../types.ts";
import { DataFlow, toSchema } from "../utils.ts";
import { assertArray, assertDate, isUndefined } from "../deps.ts";
import { assertOr } from "../asserts.ts";

/** Schema definition of built-in `Array`.
 *
 * ```ts
 * import { ArraySchema, assertSchema, StringSchema } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const value: unknown = undefined;
 * assertSchema(new ArraySchema(), value);
 * // value is `{}[]`
 * assertSchema(new ArraySchema([new StringSchema()]), value);
 * // value is `string[]`
 * ```
 */
export class ArraySchema<T>
  extends CollectiveTypeSchema<unknown, UnwrapSchema<T>[]> {
  protected override assertion: (
    value: unknown,
  ) => asserts value is UnwrapSchema<T[]>;

  constructor(private subType?: readonly T[]) {
    super();

    if (isUndefined(this.subType)) {
      this.assertion = assertArray;
    } else {
      const subType = this.subType;
      this.assertion = new DataFlow().and(assertArray).and(
        (value) => {
          value.forEach((v) => {
            const assertions = subType.map((v) => toSchema(v).assert);
            assertOr(assertions, v);
          });
        },
      ).build();
    }
  }

  protected override create = () => new ArraySchema(this.subType);
}

/** Schema of `Date` object.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   DateSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import {
 *   assertThrows,
 * } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const schema = new DateSchema();
 * assertSchema(schema, new Date());
 * assertThrows(() => assertSchema(schema, {}));
 * ```
 */
export class DateSchema extends CollectiveTypeSchema<object, Date> {
  protected override assertion: (value: object) => asserts value is Date =
    assertDate;

  protected override create = () => new DateSchema();
}
