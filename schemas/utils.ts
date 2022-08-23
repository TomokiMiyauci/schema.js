import { Result, Schema } from "../types.ts";
import { toSchemaError } from "../utils.ts";
import { isFailResult } from "../type_guards.ts";

export abstract class UnitTypeSchema<In, Out extends In>
  implements Schema<Out, In> {
  abstract assert(value: In): asserts value is Out;

  validate(value: In): Result<Out> {
    try {
      this.assert(value);
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

export abstract class CollectiveTypeSchema<In, Out extends In>
  implements Schema<Out, In> {
  abstract assert(value: unknown): asserts value is Out;

  #ands: Schema[] = [];

  /** Add subtype schema.
   * They are executed in the order in which they are added, after the supertype assertion. */
  and<T extends Out = Out>(
    schema: Schema<T, Out>,
  ): CollectiveTypeSchema<T, T> {
    this.#ands.push(schema);
    return this as CollectiveTypeSchema<any, any>;
  }

  validate(value: unknown): Result<Out> {
    try {
      this.assert(value);
      this.#ands.forEach((and) => {
        const result = and.validate(value);
        if (isFailResult(result)) {
          throw result.errors[0];
        }
      });
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
