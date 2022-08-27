import { CollectiveTypeSchema } from "./utils.ts";
import {
  assertBigint,
  assertBoolean,
  assertNull,
  assertNumber,
  assertString,
  assertSymbol,
  assertUndefined,
} from "../deps.ts";
import { Schema } from "../types.ts";

/** Schema of `boolean`. */
export class BooleanSchema extends CollectiveTypeSchema<unknown, boolean> {
  protected override assertion: (value: unknown) => asserts value is boolean =
    assertBoolean;

  protected override create: () => CollectiveTypeSchema<unknown, boolean> =
    () => new BooleanSchema();
}

/** Schema of `string`. */
export class StringSchema extends CollectiveTypeSchema<unknown, string> {
  protected override assertion: (value: unknown) => asserts value is string =
    assertString;

  protected override create = () => new StringSchema();
}

/** Schema of `number`. */
export class NumberSchema extends CollectiveTypeSchema<unknown, number> {
  protected override assertion: (value: unknown) => asserts value is number =
    assertNumber;

  protected override create = () => new NumberSchema();
}

/** Schema of `bigint`. */
export class BigintSchema extends CollectiveTypeSchema<unknown, bigint> {
  protected override assertion: (value: unknown) => asserts value is bigint =
    assertBigint;

  protected override create = () => new BigintSchema();
}

/** Schema of `undefined`. */
export class UndefinedSchema implements Schema<unknown, undefined> {
  assert = assertUndefined;
}

/** Schema of `symbol`. */
export class SymbolSchema implements Schema<unknown, symbol> {
  assert = assertSymbol;
}

/** Schema of `null`. */
export class NullSchema implements Schema<unknown, null> {
  assert = assertNull;
}
