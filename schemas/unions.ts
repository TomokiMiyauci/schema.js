import {
  arity,
  assertCountIs,
  assertGreaterThanOrEqualTo,
  assertLessThanOrEqualTo,
  assertNoNNegativeInteger,
} from "../deps.ts";
import { assertGreaterThanCount, assertLessThanCount } from "../asserts.ts";
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

  protected override create = () => new MaxSchema(this.maxValue);

  constructor(private maxValue: number | bigint) {
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

  protected override create = () => new MinSchema(this.minValue);

  constructor(private minValue: number | bigint) {
    super();
    this.assertion = arity(assertGreaterThanOrEqualTo, minValue);
  }
}

/** Schema of number of elements for `Iterable` data types.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   CountSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import {
 *   assertEquals,
 *   assertThrows,
 * } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const schema = new CountSchema(10);
 * assertSchema(schema, "abcdefghij");
 * assertThrows(() => assertSchema(schema, []));
 * ```
 */
export class CountSchema extends CollectiveTypeSchema<Iterable<unknown>> {
  protected override assertion: (
    value: Iterable<unknown>,
  ) => asserts value is Iterable<unknown>;

  protected override create = () => new CountSchema(this.count);

  constructor(private count: number) {
    super();

    assertNoNNegativeInteger(count);
    this.assertion = arity(assertCountIs, count);
  }
}

/** Schema of min number of elements for `Iterable` data types.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   MinCountSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import {
 *   assertEquals,
 *   assertThrows,
 * } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const schema = new MinCountSchema(8);
 * assertSchema(schema, "password");
 * assertThrows(() => assertSchema(schema, new Array(4)));
 * ```
 */
export class MinCountSchema extends CollectiveTypeSchema<Iterable<unknown>> {
  protected override assertion: (
    value: Iterable<unknown>,
  ) => asserts value is Iterable<unknown>;

  protected override create = () => new MinCountSchema(this.count);

  constructor(private count: number) {
    super();

    assertNoNNegativeInteger(count);
    this.assertion = arity(assertGreaterThanCount, count);
  }
}

/** Schema of max number of elements for `Iterable` data types.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   MaxCountSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import {
 *   assertEquals,
 *   assertThrows,
 * } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const schema = new MaxCountSchema(255);
 * assertSchema(schema, "https://test.com");
 * assertThrows(() => assertSchema(schema, new Array(1000)));
 * ```
 */
export class MaxCountSchema extends CollectiveTypeSchema<Iterable<unknown>> {
  protected override assertion: (
    value: Iterable<unknown>,
  ) => asserts value is Iterable<unknown>;

  protected override create = () => new MaxCountSchema(this.count);

  constructor(private count: number) {
    super();

    assertNoNNegativeInteger(count);
    this.assertion = arity(assertLessThanCount, count);
  }
}
