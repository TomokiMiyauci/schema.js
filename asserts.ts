import {
  Assertion,
  isBigint,
  isBoolean,
  isFunction,
  isNonNegativeInteger,
  isNull,
  isNumber,
  isObject,
  isString,
  isSymbol,
  isUndefined,
} from "./deps.ts";
import { Schema } from "./types.ts";
import {
  createAssertFromTypeGuard,
  createSchemaErrorThrower,
  inspect,
  toSchemaError,
} from "./utils.ts";
import { AssertionError } from "./errors.ts";
import {
  getCount,
  isEmailFormat,
  isLengthBy,
  isMaxLength,
  isMinLength,
  isSameCount,
  isSameCountBy,
} from "./type_guards.ts";

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

export function assertString(value: unknown): asserts value is string {
  createAssertFromTypeGuard(
    isString,
    createSchemaErrorThrower("string"),
  ).call(null, value);
}

export function assertBoolean(value: unknown): asserts value is boolean {
  createAssertFromTypeGuard(
    isBoolean,
    createSchemaErrorThrower("boolean"),
  ).call(null, value);
}

export function assertNumber(value: unknown): asserts value is number {
  createAssertFromTypeGuard(
    isNumber,
    createSchemaErrorThrower("number"),
  ).call(null, value);
}

export function assertBigint(value: unknown): asserts value is bigint {
  createAssertFromTypeGuard(
    isBigint,
    createSchemaErrorThrower("number"),
  ).call(null, value);
}

export function assertNull(value: unknown): asserts value is null {
  createAssertFromTypeGuard(
    isNull,
    createSchemaErrorThrower("null"),
  ).call(null, value);
}

export function assertUndefined(value: unknown): asserts value is undefined {
  createAssertFromTypeGuard(
    isUndefined,
    createSchemaErrorThrower("undefined"),
  ).call(null, value);
}

export function assertSymbol(value: unknown): asserts value is symbol {
  createAssertFromTypeGuard(
    isSymbol,
    createSchemaErrorThrower("symbol"),
  ).call(null, value);
}

export function assertFunction(value: unknown): asserts value is Function {
  createAssertFromTypeGuard(
    isFunction,
    createSchemaErrorThrower("function"),
  ).call(null, value);
}

export function assertObject(value: unknown): asserts value is object {
  createAssertFromTypeGuard(
    isObject,
    createSchemaErrorThrower("object"),
  ).call(null, value);
}

export function assertIs<T>(base: T, value: unknown): asserts value is T {
  const valid = Object.is(base, value);

  if (!valid) {
    throw new AssertionError(
      { expect: base, actual: value },
      `Not equal: ${inspect(base)} <- ${inspect(value)}`,
    );
  }
}

export function assertArray(value: unknown): asserts value is any[] {
  const result = Array.isArray(value);

  if (!result) {
    const constructor = new Object(value).constructor;
    const name = constructor.name;
    throw new AssertionError(
      { expect: Array, actual: constructor },
      `Invalid constructor. ${inspect("Array")} <- ${inspect(name)}`,
    );
  }
}

export function assertLength(
  length: number,
  value: { length: number },
): asserts value is string {
  if (!isLengthBy(length, value)) {
    throw new AssertionError({
      actual: value.length,
      expect: length,
    }, `Must be ${length} length.`);
  }
}

export function assertSameCountBy(
  count: number | bigint,
  value: Iterable<unknown>,
): asserts value is string {
  const actual = Array.from(value).length;

  if (!isSameCountBy(count, value)) {
    throw new AssertionError({
      expect: count,
      actual,
    }, `Must be ${count} element number.`);
  }
}

export function assertSameCount(
  base: Iterable<unknown>,
  value: Iterable<unknown>,
): asserts value is string {
  if (!isSameCount(base, value)) {
    const baseSize = Array.from(base).length;
    const valueSize = Array.from(value).length;
    throw new AssertionError(
      { actual: valueSize, expect: baseSize },
      `Different sizes. ${inspect(baseSize)} <- ${inspect(valueSize)}`,
    );
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

export function assertEmailFormat(value: string): asserts value is string {
  if (!isEmailFormat(value)) {
    throw new AssertionError(
      { actual: value, expect: "email format" },
      `Invalid email format.`,
    );
  }
}

export type Operand = string | number | bigint | boolean;

export function assertGreaterThanOrEqualTo(
  base: Operand,
  value: Operand,
): asserts value is Operand {
  if (base > value) {
    throw new AssertionError(
      { expect: base, actual: value },
      `Invalid range. ${inspect(base)} > ${inspect(value)}`,
    );
  }
}

export function assertLessThanOrEqualTo(
  base: Operand,
  value: Operand,
): asserts value is Operand {
  if (base < value) {
    throw new AssertionError(
      { expect: base, actual: value },
      `Invalid range. ${inspect(base)} < ${inspect(value)}`,
    );
  }
}

export function assertNoNNegativeInteger(
  value: number,
): asserts value is number {
  if (!isNonNegativeInteger(value)) {
    const expect = "non negative integer";
    throw new AssertionError({
      expect,
      actual: value,
    }, `The argument must be ${expect}.`);
  }
}
