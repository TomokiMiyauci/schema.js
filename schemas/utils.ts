import { Schema } from "../types.ts";

export abstract class CollectiveTypeSchema<
  In = unknown,
  Out extends In = In,
> implements Schema<In, Out> {
  protected abstract assertion: (value: In) => asserts value is Out;

  #schemas: Schema<Out, Out>[] = [];

  public assert = (value: In): asserts value is Out => {
    this.assertion(value);
    this.#schemas.forEach((schema) => {
      schema.assert?.(value);
    });
  };

  /** Add subtype schema.
   * They are executed in the order in which they are added, after the supertype assertion. */
  public and<T extends Out = Out>(
    schema: Schema<Out, T>,
  ): CollectiveTypeSchema<In, T> {
    const subClass = new (this as any).constructor() as CollectiveTypeSchema<
      In,
      Out
    >;

    subClass.#schemas = [...this.#schemas, schema];

    return subClass;
  }
}
