import { Assert, AssertionError } from "./deps.ts";
import { SchemaError } from "./errors.ts";
import { isSchemaError } from "./type_guards.ts";

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
