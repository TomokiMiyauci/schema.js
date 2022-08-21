import { SchemaImpl, Unwrap } from "./types.ts";
import { Schema } from "../types.ts";
import { assertFunction, assertObject, isFailResult } from "../asserts.ts";
import { SchemaError } from "../errors.ts";
import { isUndefined } from "../deps.ts";
import { DataFlow } from "../utils.ts";

/** Schema definition of `object`. */
export class ObjectSchema<T extends Record<any, Schema> | undefined = undefined>
  extends SchemaImpl<Unwrap<T extends undefined ? object : T>> {
  constructor(protected subType?: T) {
    super();

    if (!isUndefined(subType)) {
      this.dataFlow = new DataFlow().define(assertObject).define(
        (value) => {
          for (const key in this.subType) {
            const result = this.subType[key].validate(
              (value as Record<any, any>)[key],
            );

            if (isFailResult(result)) {
              const paths = result.errors[0].path.concat(key);
              const bracketStr = paths.map((path) => `["${path}"]`).join();

              throw new SchemaError(`Invalid field. \`$${bracketStr}\``, {
                children: result.errors,
              });
            }
          }
        },
      );
    }
  }

  protected override dataFlow = new DataFlow(assertObject) as DataFlow<any>;
}

/** Schema definition of `Function`. */
export class FunctionSchema extends SchemaImpl<Function> {
  protected override dataFlow = new DataFlow(assertFunction);
}
