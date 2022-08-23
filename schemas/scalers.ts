import { Assert } from "./../deps.ts";
import { CollectiveTypeSchema } from "./utils.ts";
import { arity, isUndefined } from "../deps.ts";
import {
  assertBigint,
  assertBoolean,
  assertIs,
  assertNull,
  assertNumber,
  assertString,
  assertSymbol,
  assertUndefined,
} from "../asserts.ts";
import { DataFlow, rethrow, schemaErrorThrower } from "../utils.ts";
import { Schema } from "../types.ts";

/** Schema definition of `boolean`. */
export class BooleanSchema<T extends boolean>
  extends CollectiveTypeSchema<unknown, T> {
  override assert;

  constructor(protected subType?: T) {
    super();

    if (isUndefined(subType)) {
      this.assert = assertBoolean as Assert<unknown, T>;
    } else {
      this.assert = new DataFlow(assertBoolean).define(
        rethrow(arity(assertIs, subType), schemaErrorThrower),
      ).getAssert;
    }
  }
}

/** Schema definition of `string`. */
export class StringSchema<T extends string>
  extends CollectiveTypeSchema<unknown, T> {
  override assert;

  constructor(protected subType?: T) {
    super();

    if (isUndefined(subType)) {
      this.assert = assertString as Assert<unknown, T>;
    } else {
      this.assert = new DataFlow(assertString).define(
        rethrow(arity(assertIs, subType), schemaErrorThrower),
      ).getAssert;
    }
  }
}

/** Schema definition of `number`. */
export class NumberSchema<T extends number = number>
  extends CollectiveTypeSchema<unknown, T> {
  override assert;
  constructor(protected subType?: T) {
    super();

    if (isUndefined(subType)) {
      this.assert = assertNumber as Assert<unknown, T>;
    } else {
      this.assert = new DataFlow(assertNumber).define(
        rethrow(arity(assertIs, subType), schemaErrorThrower),
      ).getAssert;
    }
  }
}

/** Schema definition of `bigint`. */
export class BigintSchema<T extends bigint = bigint>
  extends CollectiveTypeSchema<unknown, T> {
  override assert;
  constructor(protected subType?: T) {
    super();

    if (isUndefined(subType)) {
      this.assert = assertBigint as Assert<unknown, T>;
    } else {
      this.assert = new DataFlow(assertBigint).define(
        rethrow(arity(assertIs, subType), schemaErrorThrower),
      ).getAssert;
    }
  }
}

/** Schema definition of `undefined`. */
export class UndefinedSchema implements Schema<unknown, undefined> {
  assert = assertUndefined;
}

/** Schema definition of `symbol`. */
export class SymbolSchema implements Schema<unknown, symbol> {
  assert = assertSymbol;
}

/** Schema definition of `null`. */
export class NullSchema implements Schema<unknown, null> {
  assert = assertNull;
}
