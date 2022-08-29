import { AssertiveSchema, CollectiveTypeSchema } from "./utils.ts";
import { arity, assertEmailFormat, assertLengthIs } from "../deps.ts";
import {
  assertDateFormat,
  assertMaxLength,
  assertMinLength,
  assertUrlFormat,
  assertUuidFormat,
} from "../asserts.ts";
import { DateFormat } from "../validates.ts";

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

/** Schema of Date format. This is `string` subtype.
 * Compliant with {@link https://www.rfc-editor.org/rfc/rfc3339#section-5.6 RFC 3339, section-5.6, full-date}
 *
 * ```ts
 * import {
 *   assertSchema,
 *   DateFormatSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import { assertThrows } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const schema = new DateFormatSchema();
 * assertSchema(schema, "1000-01-01");
 * assertThrows(() => assertSchema(schema, "0000-00-00"));
 * assertThrows(() => assertSchema(schema, "invalid Date"));
 * ```
 */
export class DateFormatSchema extends AssertiveSchema<string, DateFormat> {
  protected override assertion: (
    value: string,
  ) => asserts value is DateFormat = assertDateFormat;
}
