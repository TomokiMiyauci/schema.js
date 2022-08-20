import { TypeSchema } from "../types.ts";
import { isFunction, isPlainObject } from "../deps.ts";

/** Schema definition of `object`. */
export class ObjectSchema extends TypeSchema<"object"> {
  protected override type = "object" as const;

  protected override typeOf = isPlainObject;
}

/** Schema definition of `Function`. */
export class FunctionSchema extends TypeSchema<"function"> {
  protected override type = "function" as const;

  protected override typeOf = isFunction;
}
