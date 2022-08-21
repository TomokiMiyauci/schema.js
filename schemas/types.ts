import { Result, Schema, UnwrapResult } from "../types.ts";
import { DataFlow } from "../utils.ts";

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
        errors: [e],
      };
    }
  }
}
