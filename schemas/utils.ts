import { Result, Schema } from "../types.ts";
import { toSchemaError } from "../utils.ts";
import { Assertion } from "../deps.ts";

export abstract class AssertSchema<Out> implements Schema<Out> {
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

export abstract class CollectiveTypeSchema<Out> implements Schema<Out> {
  abstract assert(value: unknown): asserts value is Out;

  #ands: Assertion<any, unknown>[] = [];

  /** Add assertion of subtypes.
   * They are executed in the order in which they are added, after the supertype assertion. */
  and<U extends Out = Out>(
    assert: (value: Out) => asserts value is U,
  ): CollectiveTypeSchema<U> {
    this.#ands.push(assert);
    return this as CollectiveTypeSchema<any>;
  }

  validate(value: unknown): Result<Out> {
    try {
      this.assert.call(this, value);
      this.#ands.forEach((and) => {
        and.call(this, value);
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
