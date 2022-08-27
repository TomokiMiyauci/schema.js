import { CollectiveTypeSchema } from "./utils.ts";
import { Schema, UnwrapSchema } from "../types.ts";
import { SchemaError } from "../errors.ts";
import {
  arity,
  assertArray,
  assertDate,
  assertFunction,
  assertObject,
  assertSameCount,
  inspect,
  isUndefined,
} from "../deps.ts";
import { assertOr, assertProperty } from "../asserts.ts";
import { DataFlow, toSchema, toSchemaError } from "../utils.ts";

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

/** Schema definition of built-in `Array`.
 *
 * ```ts
 * import { ArraySchema, assertSchema, StringSchema } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const value: unknown = undefined;
 * assertSchema(new ArraySchema(), value);
 * // value is `{}[]`
 * assertSchema(new ArraySchema([new StringSchema()]), value);
 * // value is `string[]`
 * ```
 */
export class ArraySchema<T>
  extends CollectiveTypeSchema<unknown, UnwrapSchema<T>[]> {
  protected override assertion: (
    value: unknown,
  ) => asserts value is UnwrapSchema<T[]>;

  constructor(private subType?: readonly T[]) {
    super();

    if (isUndefined(this.subType)) {
      this.assertion = assertArray;
    } else {
      const subType = this.subType;
      this.assertion = new DataFlow().and(assertArray).and(
        (value) => {
          value.forEach((v) => {
            const assertions = subType.map((v) => toSchema(v).assert);
            assertOr(assertions, v);
          });
        },
      ).build();
    }
  }

  protected override create = () => new ArraySchema(this.subType);
}

/** Schema of `Date` object.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   DateSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import {
 *   assertThrows,
 * } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const schema = new DateSchema();
 * assertSchema(schema, new Date());
 * assertThrows(() => assertSchema(schema, {}));
 * ```
 */
export class DateSchema extends CollectiveTypeSchema<object, Date> {
  protected override assertion: (value: object) => asserts value is Date =
    assertDate;

  protected override create = () => new DateSchema();
}
