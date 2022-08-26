import {
  Assert,
  Assertion,
  AssertionError,
  assertUndefined,
  has,
  inspect,
  ReturnAssert,
} from "./deps.ts";
import { Schema, UnwrapSchema } from "./types.ts";
import { toSchemaError } from "./utils.ts";
import { getCount, isMaxLength, isMinLength, isSchema } from "./validates.ts";

/** Assert whether the value satisfies the schema.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   BooleanSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const value: unknown = true;
 * assertSchema(new BooleanSchema(), value);
 * // value is `boolean`
 * assertSchema(new BooleanSchema(true), value);
 * // value is `true`
 * assertSchema(new BooleanSchema(false), value); // throws SchemaError
 * ```
 *
 * @throws {@link SchemaError}
 */
export function assertSchema<
  T,
  S extends Schema<T>,
>(
  schema: S,
  value: T,
): asserts value is Assertion<S["assert"]> {
  try {
    schema.assert(value);
  } catch (e) {
    throw toSchemaError(e);
  }
}

export function assertGreaterThanCount(
  count: number,
  value: Iterable<unknown>,
): asserts value is Iterable<unknown> {
  const valueCount = getCount(value);
  if (count > valueCount) {
    const countStr = inspect(count);
    throw new AssertionError(
      { actual: valueCount, expect: `greater than ${countStr}` },
      `The element numbers must be greater than ${countStr}.`,
    );
  }
}

export function assertLessThanCount(
  count: number,
  value: Iterable<unknown>,
): asserts value is Iterable<unknown> {
  const valueCount = getCount(value);
  if (count < valueCount) {
    const countStr = inspect(count);
    throw new AssertionError(
      { actual: valueCount, expect: `less than ${countStr}` },
      `The element numbers must be less than ${countStr}.`,
    );
  }
}

export function assertMaxLength(
  length: number,
  value: string,
): asserts value is string {
  if (!isMaxLength(length, value)) {
    throw new AssertionError(
      { actual: value.length, expect: length },
      `Must be ${length} or fewer characters long.`,
    );
  }
}

export function assertMinLength(
  length: number,
  value: string,
): asserts value is string {
  if (!isMinLength(length, value)) {
    throw new AssertionError(
      { actual: value.length, expect: length },
      `Must be ${length} or more characters long.`,
    );
  }
}

export function assertOr<A extends readonly Assert[]>(
  asserts: A,
  value: unknown,
): asserts value is ReturnAssert<A[number]> {
  const errors: unknown[] = [];

  for (const assert of Array.from(asserts)) {
    try {
      assert?.(value);
      return;
    } catch (e) {
      errors.push(e);
    }
  }

  throw new AggregateError(errors, "All assertions failed.");
}

export function assertEquals<T = unknown, U extends T = T>(
  a: T,
  b: U,
  compare: (a: T, b: T) => boolean = Object.is,
): asserts b is U {
  const result = compare(a, b);

  if (!result) {
    throw new AssertionError({
      actual: b,
      expect: a,
    });
  }
}

export function assertPartialProperty<T>(
  base: T,
  value: unknown,
): asserts value is Partial<UnwrapSchema<T>> {
  for (const key in base) {
    if (!has(key, value)) continue;

    const maybeSchema = base[key];
    const v = value[key];

    if (isSchema(maybeSchema)) {
      assertOr([assertUndefined, maybeSchema.assert], v);
    } else {
      assertEquals<unknown>(maybeSchema, v);
    }
  }
}
