import { Result, Schema, SuccessResult, UnwrapResult } from "../types.ts";
import { DataFlow, toSchemaError } from "../utils.ts";

export type SuccessType<S extends Schema> = UnwrapResult<
  ReturnType<S["validate"]>
>;

export type Unwrap<T extends object> = {
  [k in keyof T]: T[k] extends Schema ? SuccessType<T[k]> : T[k];
};

export abstract class SchemaImpl<Out> implements Schema<Out> {
  protected abstract dataFlow: DataFlow<Out>;

  validate(value: unknown): Result<Out> {
    try {
      this.dataFlow.assert.call(this.dataFlow, value);
      return {
        data: value as Out,
      };
    } catch (e) {
      return {
        errors: [toSchemaError(e)],
      };
    }
  }
}

export type UnwrapSchema<
  S extends Schema,
  R extends ReturnType<S["validate"]> = ReturnType<S["validate"]>,
> = R extends SuccessResult ? R["data"]
  : never;
