import { SchemaImpl } from "./types.ts";
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
export class BooleanSchema<T extends boolean> extends SchemaImpl<T> {
  constructor(protected subType?: T) {
    super();

    if (!isUndefined(subType)) {
      this.dataFlow = new DataFlow(assertBoolean).define(
        rethrow(arity(assertIs, subType), schemaErrorThrower),
      );
    }
  }

  protected override dataFlow = new DataFlow(assertBoolean) as DataFlow<T>;
}

/** Schema definition of `string`. */
export class StringSchema<T extends string = string> extends SchemaImpl<T> {
  constructor(protected subType?: T) {
    super();

    if (!isUndefined(subType)) {
      this.dataFlow = new DataFlow(assertString).define(
        rethrow(arity(assertIs, subType), schemaErrorThrower),
      );
    }
  }

  protected override dataFlow = new DataFlow(assertString) as DataFlow<T>;
}

/** Schema definition of `number`. */
export class NumberSchema<T extends number = number> extends SchemaImpl<T> {
  constructor(protected subType?: T) {
    super();

    if (!isUndefined(subType)) {
      this.dataFlow = new DataFlow(assertNumber).define(
        rethrow(arity(assertIs, subType), schemaErrorThrower),
      );
    }
  }

  protected override dataFlow = new DataFlow(assertNumber) as DataFlow<T>;
}

/** Schema definition of `bigint`. */
export class BigintSchema<T extends bigint = bigint> extends SchemaImpl<T> {
  constructor(protected subType?: T) {
    super();

    if (!isUndefined(subType)) {
      this.dataFlow = new DataFlow(assertBigint).define(
        rethrow(arity(assertIs, subType), schemaErrorThrower),
      );
    }
  }

  protected override dataFlow = new DataFlow(assertBigint) as DataFlow<T>;
}

/** Schema definition of `undefined`. */
export class UndefinedSchema extends SchemaImpl<undefined> {
  protected override dataFlow = new DataFlow(assertUndefined);
}

/** Schema definition of `symbol`. */
export class SymbolSchema extends SchemaImpl<symbol> {
  protected override dataFlow = new DataFlow(assertSymbol);
}

/** Schema definition of `null`. */
export class NullSchema extends SchemaImpl<null> {
  protected override dataFlow = new DataFlow(assertNull);
}
