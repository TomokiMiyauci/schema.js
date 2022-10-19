import { Provable, ProvableSchema, Schema } from "./types.ts";
import {
  hasOwn,
  isBigint,
  isBoolean,
  isFunction,
  isNonNullable,
  isNumber,
  isObject,
  isString,
} from "./deps.ts";
import { is } from "./checks.ts";
import { constructorName, fail, Prover } from "./utils.ts";

export function number(): ProvableSchema<number> {
  return new Prover(number.name, function* (value) {
    if (!isNumber(value)) {
      yield fail(`expected number, but actual ${typeof value}`);
    }
  });
}

export function string(): ProvableSchema<string> {
  return new Prover(string.name, function* (value) {
    if (!isString(value)) {
      yield fail(`expected string, but actual ${typeof value}`);
    }
  });
}

export function boolean(): ProvableSchema<boolean> {
  return new Prover(boolean.name, function* (value) {
    if (!isBoolean(value)) {
      yield fail(`expected boolean, but actual ${typeof value}`);
    }
  });
}

export function bigint(): ProvableSchema<bigint> {
  return new Prover(bigint.name, function* (value) {
    if (!isBigint(value)) {
      yield fail(`expected bigint, but actual ${typeof value}`);
    }
  });
}

export function func(): ProvableSchema<Function> {
  return new Prover(func.name, function* (value) {
    if (!isFunction(value)) {
      yield fail(`expected function, but actual ${typeof value}`);
    }
  });
}

export interface ObjectProvableSchema {
  readonly [k: string]: Provable<unknown>;
}

export function object<S extends ObjectProvableSchema>(
  schema: S,
): ProvableSchema<S>;
export function object(): ProvableSchema<object>;
export function object(schema?: ObjectProvableSchema): ProvableSchema<object> {
  return new Prover(object.name, function* (value, context) {
    if (!isObject(value)) {
      return yield fail(`expected object, but actual ${typeof value}`);
    }

    for (const key in schema) {
      const paths = context.paths.concat(key);

      if (!hasOwn(key, value)) {
        yield fail(`property does not exist`, {
          paths,
          causedBy: "has",
        });
        continue;
      }

      yield* schema[key].proof(value[key], { paths });
    }
  });
}

export function list<P extends Schema & Provable<unknown>>(
  schemas: readonly P[],
): ProvableSchema<P[]> {
  return new Prover(list.name, function* (value, context) {
    if (!Array.isArray(value)) {
      return yield fail(
        `expected Array, but actual ${constructorName(value)}`,
      );
    }

    for (const key in value) {
      const isSatisfy = schemas.some((schema) => is(schema, value[key]));

      if (!isSatisfy) {
        const names = schemas.map(({ name }) => name).join(", ");
        const paths = context.paths.concat(key);

        yield fail(`none of the schemas are satisfied [${names}]`, {
          paths,
        });
      }
    }
  });
}

export function or<P extends readonly (Schema & Provable<unknown>)[]>(
  ...schemas: P
): ProvableSchema<P[number]> {
  return new Prover(or.name, function* (value) {
    const valid = schemas.some((schema) => is(schema, value));

    if (!valid) {
      const names = schemas.map(({ name }) => name).join(", ");

      yield fail(`none of the schemas are satisfied [${names}]`);
    }
  });
}

export function partial<T extends P, P>(
  schema: Provable<T, P>,
): ProvableSchema<Partial<T>> {
  return new Prover(partial.name, function* (value, context) {
    for (const failure of schema.proof(value as P, context)) {
      if (failure.causedBy !== "has") {
        yield failure;
      }
    }
  });
}

export function record<K extends string, V>(
  key: Provable<K, {}>,
  value: Provable<V>,
): ProvableSchema<Record<K, V>, {}> {
  return new Prover<Record<K, V>, {}>(record.name, function* (input, context) {
    for (const k in input) {
      yield* key.proof(k, context);
      yield* value.proof(input[k as keyof {}], context);
    }
  });
}

export function nonNullable(): ProvableSchema<{}> {
  return new Prover(nonNullable.name, function* (value) {
    if (!isNonNullable(value)) {
      yield fail(`expected non nullable, but actual ${value}`);
    }
  });
}
