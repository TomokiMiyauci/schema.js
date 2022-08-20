import { SubTypeSchema, TypeSchema } from "./types.ts";
import { isFunction, isPlainObject } from "../deps.ts";

/** Schema definition of `object`. */
export class ObjectSchema<SubType extends object>
  extends SubTypeSchema<"object", SubType> {
  protected override type = "object" as const;

  protected override typeOf = isPlainObject;

  protected override subTypeOf(value: object): value is SubType {
    return this.subType === value;
  }
}

/** Schema definition of `Function`. */
export class FunctionSchema extends TypeSchema<"function"> {
  protected override type = "function" as const;

  protected override typeOf = isFunction;
}
