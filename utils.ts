import { Assertion, isString, TypeGuard } from "./deps.ts";
import { SchemaError } from "./errors.ts";
import { TypeStr } from "./types.ts";
import { isAssertionError, isSchemaError } from "./type_guards.ts";

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
): Assertion<V, R> {
  return (value) => {
    const result = typeGuard(value);
    if (!result) {
      onFail(value);
    }
  };
}

export class DataFlow<In = unknown, Out extends In = In> {
  assertions: Assertion<In, Out>[] = [];

  constructor(...assertions: Assertion<In, Out>[]) {
    this.assertions = assertions;
  }

  define<S extends Out = Out>(assertion: Assertion<In, S>): DataFlow<S, S> {
    return new DataFlow<S, S>(...this.assertions.concat(assertion));
  }

  assert(value: unknown): asserts value is Out {
    for (const assertion of this.assertions) {
      assertion(value as Out);
    }
  }

  get getAssert() {
    return this.assert.bind(this);
  }

  is(value: unknown): value is Out {
    for (const assertion of this.assertions) {
      try {
        assertion(value as Out);
      } catch {
        return false;
      }
    }
    return true;
  }
}

export function toSchemaError(e: unknown): SchemaError {
  if (isSchemaError(e)) return e;

  if (isAssertionError(e)) {
    return new SchemaError(e.message, { cause: e });
  }

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

export function inspect(value: unknown): string {
  if (isString(value)) {
    return `"${value}"`;
  }

  return String(value);
}
