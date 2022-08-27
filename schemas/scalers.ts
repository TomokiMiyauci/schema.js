import { CollectiveTypeSchema } from "./utils.ts";
import {
  arity,
  assertBigint,
  assertBoolean,
  assertIs,
  assertNull,
  assertNumber,
  assertString,
  assertSymbol,
  assertUndefined,
  isUndefined,
} from "../deps.ts";
import { DataFlow } from "../utils.ts";
import { Schema } from "../types.ts";

/** Schema of `boolean`. */
export class BooleanSchema<T extends boolean>
  extends CollectiveTypeSchema<unknown, T> {
  protected override assertion: (value: unknown) => asserts value is T;

  protected override create: () => CollectiveTypeSchema<unknown, T> = () =>
    new BooleanSchema(this.subType);

  constructor(private subType?: T) {
    super();

    if (isUndefined(subType)) {
      this.assertion = assertBoolean;
    } else {
      this.assertion = new DataFlow(assertBoolean).and(
        arity(assertIs, subType),
      ).build();
    }
  }
}

/** Schema of `string`. */
export class StringSchema<T extends string>
  extends CollectiveTypeSchema<unknown, T> {
  protected override assertion: (value: unknown) => asserts value is T;

  constructor(private subType?: T) {
    super();

    if (isUndefined(subType)) {
      this.assertion = assertString;
    } else {
      this.assertion = new DataFlow(assertString).and(
        arity(assertIs, subType),
      ).build();
    }
  }

  protected override create = () => new StringSchema(this.subType);
}

/** Schema of `number`. */
export class NumberSchema<T extends number = number>
  extends CollectiveTypeSchema<unknown, T> {
  protected override assertion: (value: unknown) => asserts value is T;
  constructor(private subType?: T) {
    super();

    if (isUndefined(subType)) {
      this.assertion = assertNumber;
    } else {
      this.assertion = new DataFlow(assertNumber).and(
        arity(assertIs, subType),
      ).build();
    }
  }

  protected override create = () => new NumberSchema(this.subType);
}

/** Schema of `bigint`. */
export class BigintSchema<T extends bigint = bigint>
  extends CollectiveTypeSchema<unknown, T> {
  protected override assertion: (value: unknown) => asserts value is T;
  constructor(private subType?: T) {
    super();

    if (isUndefined(subType)) {
      this.assertion = assertBigint;
    } else {
      this.assertion = new DataFlow(assertBigint).and(
        arity(assertIs, subType),
      ).build();
    }
  }

  protected override create = () => new BigintSchema(this.subType);
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
