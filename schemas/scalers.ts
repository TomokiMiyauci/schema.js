import { SubTypeSchema, TypeSchema } from "../types.ts";
import {
  isBoolean,
  isNull,
  isNumber,
  isString,
  isSymbol,
  isUndefined,
} from "../deps.ts";

/** Schema definition of `boolean`. */
export class BooleanSchema<SubType extends boolean>
  extends SubTypeSchema<"boolean", SubType> {
  constructor(protected subType?: SubType) {
    super(subType);
  }
  protected override type = "boolean" as const;
  protected override typeOf = isBoolean;

  protected override subTypeOf(value: boolean): value is SubType {
    return value === this.subType;
  }
}

/** Schema definition of `string`. */
export class StringSchema<SubType extends string>
  extends SubTypeSchema<"string", SubType> {
  constructor(protected subType?: SubType) {
    super(subType);
  }
  protected override type = "string" as const;

  protected override typeOf = isString;

  override subTypeOf(value: string): value is SubType {
    return value === this.subType;
  }
}

/** Schema definition of `number`. */
export class NumberSchema<SubType extends number>
  extends SubTypeSchema<"number", SubType> {
  constructor(protected subType?: SubType) {
    super(subType);
  }
  override type = "number" as const;

  override typeOf = isNumber;

  override subTypeOf(value: number): value is SubType {
    return value === this.subType;
  }
}

/** Schema definition of `bigint`. */
export class BigintSchema<SubType extends bigint>
  extends SubTypeSchema<"bigint", SubType> {
  constructor(protected subType?: SubType) {
    super(subType);
  }

  override type = "bigint" as const;

  override typeOf(value: unknown): value is SubType {
    return typeof value === "bigint";
  }

  override subTypeOf(value: bigint): value is SubType {
    return value === this.subType;
  }
}

/** Schema definition of `undefined`. */
export class UndefinedSchema extends TypeSchema<"undefined"> {
  protected override type = "undefined" as const;

  protected override typeOf = isUndefined;
}

/** Schema definition of `symbol`. */
export class SymbolSchema extends TypeSchema<"symbol"> {
  protected override type = "symbol" as const;

  protected override typeOf = isSymbol;
}

/** Schema definition of `null`. */
export class NullSchema extends TypeSchema<"null"> {
  protected type = "null" as const;

  protected typeOf = isNull;
}
