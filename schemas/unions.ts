import {
  assertGreaterThanOrEqualTo,
  assertLessThanOrEqualTo,
} from "../asserts.ts";
import { arity } from "../deps.ts";
import { CollectiveTypeSchema } from "./utils.ts";

/** Schema of max value for `number` or `bigint` subtype.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   MaxSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import { assertThrows } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertSchema(new MaxSchema(10), 5);
 * assertThrows(() => assertSchema(new MaxSchema(10), 11));
 * ```
 */
export class MaxSchema extends CollectiveTypeSchema<number | bigint> {
  protected override assertion: (
    value: number | bigint,
  ) => asserts value is number | bigint;

  constructor(maxValue: number | bigint) {
    super();
    this.assertion = arity(assertLessThanOrEqualTo, maxValue);
  }
}

/** Schema of min value for `number` or `bigint` subtype.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   MinSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import { assertThrows } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertSchema(new MinSchema(5), 10);
 * assertThrows(() => assertSchema(new MinSchema(5), 0));
 * ```
 */
export class MinSchema extends CollectiveTypeSchema<number | bigint> {
  protected override assertion: (
    value: number | bigint,
  ) => asserts value is number | bigint;

  constructor(minValue: number | bigint) {
    super();
    this.assertion = arity(assertGreaterThanOrEqualTo, minValue);
  }
}
