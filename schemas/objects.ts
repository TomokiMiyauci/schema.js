import { CollectiveTypeSchema } from "./utils.ts";
import { Schema, UnwrapSchema } from "../types.ts";
import { SchemaError } from "../errors.ts";
import {
  arity,
  assertFunction,
  assertObject,
  assertSameCount,
  inspect,
  isUndefined,
} from "../deps.ts";
import { assertProperty } from "../asserts.ts";
import { DataFlow, toSchemaError } from "../utils.ts";

/** Schema definition of `object`. */
export class ObjectSchema<T extends object> extends CollectiveTypeSchema<
  unknown,
  UnwrapSchema<T>
> {
  protected override assertion: (
    value: unknown,
  ) => asserts value is UnwrapSchema<T>;

  constructor(protected subType?: T) {
    super();

    if (isUndefined(subType)) {
      this.assertion = assertObject;
    } else {
      this.assertion = new DataFlow().and(assertObject).and(
        arity(assertProperty, subType),
      ).build();
    }
  }

  protected override create = () => new ObjectSchema(this.subType);
}

/** Schema definition of `Function`. */
export class FunctionSchema implements Schema<unknown, Function> {
  assert = assertFunction;
}

/** Schema definition of tuple What is `Array` object sub-types. */
export class TupleSchema<T extends Schema[]>
  extends CollectiveTypeSchema<ReadonlyArray<any>, UnwrapSchema<T>> {
  #subType;
  constructor(...subType: T) {
    super();
    this.#subType = subType;
  }
  protected override assertion: (
    value: readonly any[],
  ) => asserts value is UnwrapSchema<T> = (value) => {
    assertSameCount(this.#subType, value);

    for (const [index, schema] of this.#subType.entries()) {
      try {
        schema.assert?.(value[index]);
      } catch (e) {
        const error = toSchemaError(e);
        const paths = error.path.concat(index);
        const bracketStr = paths.map((path) => `[${inspect(path)}]`)
          .join();
        throw new SchemaError(`Invalid field. \`$${bracketStr}\``, {
          children: [error],
          path: paths,
        });
      }
    }
  };

  protected override create = () => new TupleSchema(...this.#subType);
}
