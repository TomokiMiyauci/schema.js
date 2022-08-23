import { Schema } from "../types.ts";

export abstract class CollectiveTypeSchema<In, Out extends In>
  implements Schema<In, Out> {
  abstract assert(value: unknown): asserts value is Out;

  #ands: Schema[] = [];

  /** Add subtype schema.
   * They are executed in the order in which they are added, after the supertype assertion. */
  and<T extends Out = Out>(
    schema: Schema<Out, T>,
  ): CollectiveTypeSchema<T, T> {
    this.#ands.push(schema);
    return this as CollectiveTypeSchema<any, any>;
  }
}
