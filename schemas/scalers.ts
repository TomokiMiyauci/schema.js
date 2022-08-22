import { AssetSchema } from "./utils.ts";
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
export class BooleanSchema<T extends boolean> extends AssetSchema<T> {
  constructor(protected subType?: T) {
    super();

    if (!isUndefined(subType)) {
      this.assert = new DataFlow(assertBoolean).define(
        rethrow(arity(assertIs, subType), schemaErrorThrower),
      ).getAssert;
    }
  }

  override assert = assertBoolean;
}

/** Schema definition of `string`. */
export class StringSchema<T extends string = string> extends AssetSchema<T> {
  constructor(protected subType?: T) {
    super();

    if (!isUndefined(subType)) {
      this.assert = new DataFlow(assertString).define(
        rethrow(arity(assertIs, subType), schemaErrorThrower),
      ).getAssert;
    }
  }

  override assert = assertString;
}

/** Schema definition of `number`. */
export class NumberSchema<T extends number = number> extends AssetSchema<T> {
  constructor(protected subType?: T) {
    super();

    if (!isUndefined(subType)) {
      this.assert = new DataFlow(assertNumber).define(
        rethrow(arity(assertIs, subType), schemaErrorThrower),
      ).getAssert;
    }
  }

  override assert = assertNumber;
}

/** Schema definition of `bigint`. */
export class BigintSchema<T extends bigint = bigint> extends AssetSchema<T> {
  constructor(protected subType?: T) {
    super();

    if (!isUndefined(subType)) {
      this.assert = new DataFlow(assertBigint).define(
        rethrow(arity(assertIs, subType), schemaErrorThrower),
      ).getAssert;
    }
  }

  override assert = assertBigint;
}

/** Schema definition of `undefined`. */
export class UndefinedSchema extends AssetSchema<undefined> {
  override assert = assertUndefined;
}

/** Schema definition of `symbol`. */
export class SymbolSchema extends AssetSchema<symbol> {
  override assert = assertSymbol;
}

/** Schema definition of `null`. */
export class NullSchema extends AssetSchema<null> {
  override assert = assertNull;
}
