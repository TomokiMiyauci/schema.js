import { Unwrap } from "./types.ts";
import { AssertSchema, CollectiveTypeSchema } from "./utils.ts";
import { Schema } from "../types.ts";
import { assertFunction, assertObject } from "../asserts.ts";
import { SchemaError } from "../errors.ts";
import { isUndefined } from "../deps.ts";
import { DataFlow, inspect } from "../utils.ts";
import { isFailResult } from "../type_guards.ts";

/** Schema definition of `object`. */
export class ObjectSchema<T extends Record<any, Schema> | undefined = undefined>
  extends CollectiveTypeSchema<Unwrap<T extends undefined ? object : T>> {
  override assert;
  constructor(protected subType?: T) {
    super();

    if (isUndefined(subType)) {
      this.assert = assertObject;
    } else {
      this.assert = new DataFlow().define(assertObject).define(
        (value) => {
          for (const key in this.subType) {
            const result = this.subType[key].validate(
              (value as Record<any, any>)[key],
            );

            if (isFailResult(result)) {
              const paths = result.errors[0].path.concat(key);
              const bracketStr = paths.map((path) => `[${inspect(path)}]`)
                .join();

              throw new SchemaError(`Invalid field. \`$${bracketStr}\``, {
                children: result.errors,
                path: paths,
              });
            }
          }
        },
      ).getAssert;
    }
  }
}

/** Schema definition of `Function`. */
export class FunctionSchema extends AssertSchema<unknown, Function> {
  override assert = assertFunction;
}
