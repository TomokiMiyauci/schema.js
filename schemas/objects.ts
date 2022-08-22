import { Unwrap } from "./types.ts";
import { AssetSchema } from "./utils.ts";
import { Schema } from "../types.ts";
import { assertFunction, assertObject } from "../asserts.ts";
import { SchemaError } from "../errors.ts";
import { isUndefined } from "../deps.ts";
import { DataFlow, inspect } from "../utils.ts";
import { isFailResult } from "../type_guards.ts";

/** Schema definition of `object`. */
export class ObjectSchema<T extends Record<any, Schema> | undefined = undefined>
  extends AssetSchema<Unwrap<T extends undefined ? object : T>> {
  constructor(protected subType?: T) {
    super();

    if (!isUndefined(subType)) {
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

  override assert = assertObject;
}

/** Schema definition of `Function`. */
export class FunctionSchema extends AssetSchema<Function> {
  override assert = assertFunction;
}
