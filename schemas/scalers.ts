import { AssertSchema, CollectiveTypeSchema } from "./utils.ts";
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

/** Schema definition of `boolean`. */
export class BooleanSchema<T extends boolean> extends CollectiveTypeSchema<T> {
  override assert;

  constructor(protected subType?: T) {
    super();

    if (isUndefined(subType)) {
      this.assert = assertBoolean;
    } else {
      this.assert = new DataFlow(assertBoolean).define(
        rethrow(arity(assertIs, subType), schemaErrorThrower),
      ).getAssert;
    }
  }
}

/** Schema definition of `string`. */
export class StringSchema<T extends string> extends CollectiveTypeSchema<T> {
  override assert;

  constructor(protected subType?: T) {
    super();

    if (isUndefined(subType)) {
      this.assert = assertString;
    } else {
      this.assert = new DataFlow(assertString).define(
        rethrow(arity(assertIs, subType), schemaErrorThrower),
      ).getAssert;
    }
  }
}

/** Schema definition of `number`. */
export class NumberSchema<T extends number = number>
  extends CollectiveTypeSchema<T> {
  override assert;
  constructor(protected subType?: T) {
    super();

    if (isUndefined(subType)) {
      this.assert = assertNumber;
    } else {
      this.assert = new DataFlow(assertNumber).define(
        rethrow(arity(assertIs, subType), schemaErrorThrower),
      ).getAssert;
    }
  }
}

/** Schema definition of `bigint`. */
export class BigintSchema<T extends bigint = bigint>
  extends CollectiveTypeSchema<T> {
  override assert;
  constructor(protected subType?: T) {
    super();

    if (isUndefined(subType)) {
      this.assert = assertBigint;
    } else {
      this.assert = new DataFlow(assertBigint).define(
        rethrow(arity(assertIs, subType), schemaErrorThrower),
      ).getAssert;
    }
  }
}

/** Schema definition of `undefined`. */
export class UndefinedSchema extends AssertSchema<unknown, undefined> {
  override assert = assertUndefined;
}

/** Schema definition of `symbol`. */
export class SymbolSchema extends AssertSchema<unknown, symbol> {
  override assert = assertSymbol;
}

/** Schema definition of `null`. */
export class NullSchema extends AssertSchema<unknown, null> {
  override assert = assertNull;
}
