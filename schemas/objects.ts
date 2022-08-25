import { CollectiveTypeSchema } from "./utils.ts";
import { Schema, UnwrapSchema } from "../types.ts";
import { SchemaError } from "../errors.ts";
import {
  arity,
  assertExistsPropertyOf,
  assertFunction,
  assertObject,
  assertSameCount,
  inspect,
  isUndefined,
} from "../deps.ts";
import { DataFlow, toSchemaError } from "../utils.ts";

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
  protected override assertion: (
    value: unknown,
  ) => asserts value is Unwrap<T extends undefined ? object : T>;
  constructor(protected subType?: T) {
    super();

    if (isUndefined(subType)) {
      this.assertion = assertObject;
    } else {
      this.assertion = new DataFlow().and(assertObject).and(
        arity(assertSchemaRecord, subType),
      ).build();
    }
  }

  protected override create = () => new ObjectSchema(this.subType);
}

export function assertSchemaRecord<T extends { [k: string]: Schema }>(
  record: T,
  value: object,
): asserts value is Unwrap<T> {
  for (const key in record) {
    assertExistsPropertyOf(key, value);

    try {
      record[key].assert?.(
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
}

/** Schema definition of `Function`. */
export class FunctionSchema implements Schema<unknown, Function> {
  assert = assertFunction;
}

/** Schema definition of tuple What is `Array` object sub-types. */
export class TupleSchema<T extends Schema[]>
  extends CollectiveTypeSchema<ReadonlyArray<any>, Unwrap<T>> {
  #subType;
  constructor(...subType: T) {
    super();
    this.#subType = subType;
  }
  protected override assertion: (
    value: readonly any[],
  ) => asserts value is Unwrap<T> = (value) => {
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
