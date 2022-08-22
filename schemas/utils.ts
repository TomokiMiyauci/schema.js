import { Result, Schema } from "../types.ts";
import { toSchemaError } from "../utils.ts";

export abstract class AssetSchema<Out> implements Schema<Out> {
  abstract assert(value: unknown): asserts value is Out;

  validate(value: unknown): Result<Out> {
    try {
      this.assert.call(this, value);
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
