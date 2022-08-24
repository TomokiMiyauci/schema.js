import {
  assertEmailFormat,
  assertLength,
  assertMaxLength,
  assertMinLength,
} from "../asserts.ts";
import { CollectiveTypeSchema } from "./utils.ts";
import { arity } from "../deps.ts";

export class LengthSchema<T extends string>
  extends CollectiveTypeSchema<string, T> {
  protected override assertion: (value: string) => asserts value is T;

  constructor(private length: number) {
    super();
    this.assertion = arity(assertLength, length);
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
 *   StringEmailSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const emailFormatAndLessThan20 = new StringEmailSchema().and(
 *   new MaxLengthSchema(20),
 * );
 * assertSchema(emailFormatAndLessThan20, "contact@test.test");
 * ```
 */
export class StringEmailSchema extends CollectiveTypeSchema<string> {
  protected override assertion: (value: string) => asserts value is string =
    assertEmailFormat;

  protected override create = () => new StringEmailSchema();
}
