import { CollectiveTypeSchema } from "./utils.ts";
import { Schema, UnwrapSchema } from "../types.ts";
import { assertFunction, assertObject } from "../asserts.ts";
import { SchemaError } from "../errors.ts";
import { Assert, isUndefined } from "../deps.ts";
import { DataFlow, inspect, toSchemaError } from "../utils.ts";

type Unwrap<T> = {
  [k in keyof T]: T[k] extends object ? UnwrapSchema<T[k]> : T[k];
};

/** Schema definition of `object`. */
export class ObjectSchema<
  T extends Record<any, Schema> | undefined = undefined,
> extends CollectiveTypeSchema<
  unknown,
  Unwrap<T extends undefined ? object : T>
> {
  override assert;
  constructor(protected subType?: T) {
    super();

    if (isUndefined(subType)) {
      this.assert = assertObject as Assert<
        unknown,
        Unwrap<T extends undefined ? object : T>
      >;
    } else {
      this.assert = new DataFlow().define(assertObject).define(
        (value) => {
          for (const key in this.subType) {
            try {
              this.subType[key].assert?.(
                (value as Record<any, any>)[key],
              );
            } catch (e) {
              const error = toSchemaError(e);
              const paths = error.path.concat(key);
              const bracketStr = paths.map((path) => `[${inspect(path)}]`)
                .join();
              throw new SchemaError(`Invalid field. \`$${bracketStr}\``, {
                children: [error],
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
export class FunctionSchema implements Schema<unknown, Function> {
  assert = assertFunction;
}
