import { Assert, inspect, TypeGuard } from "./deps.ts";
import { SchemaError } from "./errors.ts";
import { TypeStr } from "./types.ts";
import { isSchemaError } from "./type_guards.ts";

export function createSchemaErrorThrower(
  type: TypeStr,
): (value: unknown) => never {
  return (value) => {
    const actual = typeof value;

    throw new SchemaError(
      `Invalid type. ${inspect(type)} <- ${inspect(actual)}`,
      {
        actual,
        expected: type,
      },
    );
  };
}

export function createAssertFromTypeGuard<V, R extends V>(
  typeGuard: TypeGuard<V, R>,
  onFail: (value: V) => never,
): Assert<V, R> {
  return (value) => {
    const result = typeGuard(value);
    if (!result) {
      onFail(value);
    }
  };
}

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

  if (e instanceof Error) {
    return new SchemaError(`${e.name} has occurred.`, { cause: e });
  }

  return new SchemaError(`Unknown error has occurred.`);
}

export function schemaErrorThrower(value: unknown): never {
  throw toSchemaError(value);
}

export function rethrow<F extends (value: unknown) => never | void>(
  fn: F,
  thrower: (e: unknown) => never,
): (...args: Parameters<F>) => void | never {
  return (...args) => {
    try {
      fn.apply(null, args);
    } catch (e) {
      thrower(e);
    }
  };
}
