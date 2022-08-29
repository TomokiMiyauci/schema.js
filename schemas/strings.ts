import { AssertiveSchema, CollectiveTypeSchema } from "./utils.ts";
import { arity, assertEmailFormat, assertLengthIs } from "../deps.ts";
import {
  assertMaxLength,
  assertMinLength,
  assertUrlFormat,
  assertUuidFormat,
} from "../asserts.ts";

export class LengthSchema<T extends string>
  extends CollectiveTypeSchema<string, T> {
  protected override assertion: (value: string) => asserts value is T;

  constructor(private length: number) {
    super();
    this.assertion = arity(assertLengthIs, length);
  }

  protected override create = () => new LengthSchema(this.length);
}

export class MaxLengthSchema<T extends string>
  extends CollectiveTypeSchema<string, T> {
  protected override assertion: (value: string) => asserts value is T;

  constructor(private length: number) {
    super();
    this.assertion = arity(assertMaxLength, length);
  }

  protected override create = () => new MaxLengthSchema(this.length);
}

export class MinLengthSchema<T extends string>
  extends CollectiveTypeSchema<string, T> {
  protected override assertion: (value: string) => asserts value is T;

  constructor(private length: number) {
    super();
    this.assertion = arity(assertMinLength, length);
  }

  protected override create = () => new MinLengthSchema(this.length);
}

/** Schema of `string` subtype of email format.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   MaxLengthSchema,
 *   EmailFormatSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const emailFormatAndLessThan20 = new EmailFormatSchema().and(
 *   new MaxLengthSchema(20),
 * );
 * assertSchema(emailFormatAndLessThan20, "contact@test.test");
 * ```
 */
export class EmailFormatSchema extends CollectiveTypeSchema<string> {
  protected override assertion: (value: string) => asserts value is string =
    assertEmailFormat;

  protected override create = () => new EmailFormatSchema();
}

/** Schema of UUID format. This is `string` subtype.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   UuidFormatSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import { assertThrows } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const schema = new UuidFormatSchema();
 * assertSchema(schema, "00000000-0000-0000-0000-000000000000");
 * assertThrows(() => assertSchema(schema, "invalid UUID"));
 * ```
 */
export class UuidFormatSchema extends AssertiveSchema<string> {
  protected override assertion: (value: string) => asserts value is string =
    assertUuidFormat;
}

/** Schema of URL format. This is `string` subtype.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   UrlFormatSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import { assertThrows } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const schema = new UrlFormatSchema();
 * assertSchema(schema, "http://localhost");
 * assertThrows(() => assertSchema(schema, "invalid URL"));
 * ```
 */
export class UrlFormatSchema extends AssertiveSchema<string> {
  protected override assertion: (value: string) => asserts value is string =
    assertUrlFormat;
}
