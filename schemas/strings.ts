import { AssertiveSchema, CollectiveTypeSchema } from "./utils.ts";
import { arity, assertEmailFormat, assertLengthIs } from "../deps.ts";
import {
  assertDateFormat,
  assertDateTimeFormat,
  assertHostnameFormat,
  assertIpv4Format,
  assertIpv6Format,
  assertMatchPattern,
  assertMaxLength,
  assertMinLength,
  assertTimeFormat,
  assertUriFormat,
  assertUrlFormat,
  assertUuidFormat,
} from "../asserts.ts";
import { DateTime, FullDate, FullTime, Ipv4Format } from "../validates.ts";

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

/** Schema of date format. This is `string` subtype.
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
 * assertThrows(() => assertSchema(schema, "invalid date"));
 * ```
 */
export class DateFormatSchema extends AssertiveSchema<string, FullDate> {
  protected override assertion: (
    value: string,
  ) => asserts value is FullDate = assertDateFormat;
}

/** Schema of time format. This is `string` subtype.
 * Compliant with {@link https://www.rfc-editor.org/rfc/rfc3339#section-5.6 RFC 3339, section-5.6, full-time}
 * ```ts
 * import {
 *   assertSchema,
 *   TimeFormatSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import { assertThrows } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const schema = new TimeFormatSchema();
 * assertSchema(schema, "00:00:00Z");
 * assertSchema(schema, "23:59:59+19:59");
 * assertThrows(() => assertSchema(schema, "00:00:00"));
 * assertThrows(() => assertSchema(schema, "invalid time"));
 * ```
 */
export class TimeFormatSchema extends AssertiveSchema<string, FullTime> {
  protected override assertion: (
    value: string,
  ) => asserts value is FullTime = assertTimeFormat;
}

/** Schema of date time format. This is `string` subtype.
 * Compliant with {@link https://www.rfc-editor.org/rfc/rfc3339#section-5.6 RFC 3339, section-5.6, date-time}
 * ```ts
 * import {
 *   assertSchema,
 *   DateTimeFormatSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import { assertThrows } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const schema = new DateTimeFormatSchema();
 * assertSchema(schema, "1000-01-01T00:00:00Z");
 * assertSchema(schema, "9999-12-31T23:59:59+19:59");
 * assertThrows(() => assertSchema(schema, "0000-00-00:00:00:00Z"));
 * assertThrows(() => assertSchema(schema, "invalid date time"));
 * ```
 */
export class DateTimeFormatSchema extends AssertiveSchema<string, DateTime> {
  protected override assertion: (
    value: string,
  ) => asserts value is DateTime = assertDateTimeFormat;
}

/** Schema of hostname format. This is `string` subtype.
 *
 * Compliant with {@link https://www.rfc-editor.org/rfc/rfc1123#page-13 RFC 1123, 2.1 Host Names and Numbers}.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   HostnameFormatSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import { assertThrows } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const schema = new HostnameFormatSchema();
 * assertSchema(schema, "a");
 * assertThrows(() => assertSchema(schema, "a".repeat(64)));
 * assertThrows(() => assertSchema(schema, "invalid hostname"));
 * ```
 */
export class HostnameFormatSchema extends AssertiveSchema<string> {
  protected override assertion: (
    value: string,
  ) => asserts value is string = assertHostnameFormat;
}

/** Schema of regex pattern. This is `string` subtype.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   PatternSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import { assertThrows } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const schema = new PatternSchema(/^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$/);
 * assertSchema(schema, "555-1212");
 * assertSchema(schema, "(888)555-1212");
 * assertThrows(() => assertSchema(schema, "(888)555-1212 ext. 532"));
 * assertThrows(() => assertSchema(schema, "invalid phone number"));
 * ```
 */
export class PatternSchema extends AssertiveSchema<string> {
  protected override assertion: (value: string) => asserts value is string;

  constructor(pattern: RegExp | string) {
    super();
    this.assertion = arity(assertMatchPattern, pattern);
  }
}

/** Schema of IPv4 format. This is `string` subtype.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   Ipv4FormatSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import { assertThrows } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const schema = new Ipv4FormatSchema();
 * assertSchema(schema, "0.0.0.0");
 * assertSchema(schema, "127.0.0.1");
 * assertThrows(() => assertSchema(schema, "256.255.255.255"));
 * assertThrows(() => assertSchema(schema, "invalid IPv4"));
 * ```
 */
export class Ipv4FormatSchema extends AssertiveSchema<string, Ipv4Format> {
  protected override assertion: (value: string) => asserts value is Ipv4Format =
    assertIpv4Format;
}

/** Schema of IPv6 format. This is `string` subtype.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   Ipv6FormatSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import { assertThrows } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const schema = new Ipv6FormatSchema();
 * assertSchema(schema, "::");
 * assertThrows(() => assertSchema(schema, ":"));
 * assertThrows(() => assertSchema(schema, "invalid IPv6"));
 * ```
 */
export class Ipv6FormatSchema extends AssertiveSchema<string> {
  protected override assertion: (value: string) => asserts value is string =
    assertIpv6Format;
}

/** Schema of URI format. This is `string` subtype.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   UriFormatSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import { assertThrows } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const schema = new UriFormatSchema();
 * assertSchema(
 *   schema,
 *   "https://user:password@www.example.test:123/path/to/?tag=networking&order=newest#top",
 * );
 * assertThrows(() => assertSchema(schema, "invalid URI"));
 * ```
 */
export class UriFormatSchema extends AssertiveSchema<string> {
  protected override assertion: (value: string) => asserts value is string =
    assertUriFormat;
}
