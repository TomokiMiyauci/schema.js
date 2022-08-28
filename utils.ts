import { Assert, AssertionError } from "./deps.ts";
import { SchemaError } from "./errors.ts";
import { isSchema, isSchemaError } from "./validates.ts";
import { assertEquals } from "./asserts.ts";
import { InferSchema, Schema, SchemaContext } from "./types.ts";

export class DataFlow<In = unknown, Out extends In = In> {
  assertions: Assert<In, Out>[] = [];

  constructor(...assertions: Assert<In, Out>[]) {
    this.assertions = assertions;
  }

  and<S extends Out = Out>(assertion: Assert<In, S>): DataFlow<S, S> {
    return new DataFlow<S, S>(...this.assertions.concat(assertion));
  }

  build(): (value: unknown) => asserts value is Out {
    return (value) => {
      for (const assertion of this.assertions) {
        assertion(value as Out);
      }
    };
  }
}

export function toSchemaError(e: unknown): SchemaError {
  if (isSchemaError(e)) return e;

  if (e instanceof AssertionError) {
    return new SchemaError(e.message);
  }

  if (e instanceof Error) {
    return new SchemaError(`${e.name} has occurred.`, { cause: e });
  }

  return new SchemaError(`Unknown error has occurred.`);
}

/** Convert value to schema. */
export function toSchema(
  value: unknown,
  ctx: SchemaContext = { equality: Object.is },
): Schema {
  if (isSchema(value)) return value;

  class S implements Schema {
    assert: (value: unknown) => asserts value is unknown = (value2) => {
      assertEquals(value, value2, ctx.equality);
    };
  }

  return new S();
}

export function defineSchemaProperty<
  T extends new (...args: any) => Schema<any>,
  K extends PropertyKey,
  U extends new (...args: any) => SubSchema<InstanceType<T>>,
>(
  schema: T,
  key: K,
  subSchema: U,
): new (
  ...args: ConstructorParameters<T>
) =>
  & InstanceType<T>
  & Cycle<
    { [k in K]: (...args: ConstructorParameters<U>) => InstanceType<T> }
  > {
  function createSchema(...args: ConstructorParameters<T>) {
    const Schema = new schema(args);
    const asserts: Assert<any>[] = [Schema.assert];

    Object.defineProperty(Schema, key, {
      value: (...args: ConstructorParameters<U>) => {
        const cls = new subSchema(...args as any);
        asserts.push(cls.assert);

        return Schema;
      },
    });

    Schema.assert = (value) => {
      asserts.forEach((assert) => {
        assert?.(value);
      });
    };

    return Schema;
  }

  return createSchema as any;
}

type Cycle<
  T extends Record<PropertyKey, (...args: any) => any>,
> = {
  [k in keyof T]: (...args: Parameters<T[k]>) => ReturnType<T[k]> & Cycle<T>;
};

type SubSchema<S extends Schema<any>> = Schema<InferSchema<S>>;
