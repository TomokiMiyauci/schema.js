import { Provable, Schema } from "./types.ts";
import {
  hasOwn,
  isBigint,
  isBoolean,
  isFunction,
  isNumber,
  isObject,
  isString,
} from "./deps.ts";
import { is } from "./checks.ts";
import { constructorName, fail, Prover, show } from "./utils.ts";

export function number(): Schema<number> {
  return new Prover(function* (value) {
    if (!isNumber(value)) {
      yield fail(`Invalid data type.
Expected: ${show("number")}
Actual: ${show(typeof value)}`);
    }
  });
}

export function string(): Schema<string> {
  return new Prover(function* (value) {
    if (!isString(value)) {
      yield fail(`Invalid data type.
  Expected: string
  Actual: ${typeof value}`);
    }
  });
}

export function boolean(): Schema<boolean> {
  return new Prover(function* (value) {
    if (!isBoolean(value)) {
      yield fail("Invalid data");
    }
  });
}

export function bigint(): Schema<bigint> {
  return new Prover(function* (value) {
    if (!isBigint(value)) {
      yield fail("Invalid data");
    }
  });
}

export function func(): Schema<Function> {
  return new Prover(function* (value) {
    if (!isFunction(value)) {
      yield fail("Invalid data");
    }
  });
}

export interface ObjectSchema {
  readonly [k: string]: Provable<unknown>;
}

export function object<S extends ObjectSchema>(schema: S): Schema<S>;
export function object(): Schema<object>;
export function object(schema?: ObjectSchema): Schema<object> {
  return new Prover(function* (value) {
    if (!isObject(value)) {
      return yield fail(
        `Invalid data type. Expected: object, Actual: ${show(typeof value)}`,
      );
    }

    for (const key in schema) {
      if (!hasOwn(key, value)) {
        yield fail(`Property is not exist. ${show(key)}`, {
          causedBy: "has",
        });
        continue;
      }

      yield* schema[key].proof(value[key]);
    }
  });
}

export function list<P extends Provable<unknown>>(
  schemas: readonly P[],
): Schema<P[]> {
  return new Prover(function* (value) {
    if (!Array.isArray(value)) {
      return yield fail(`Invalid constructor.
      Expected: Array
      Actual: ${constructorName(value)}`);
    }

    const isSatisfy = value.every((v) =>
      schemas.some((schema) => is(schema, v))
    );

    if (!isSatisfy) {
      yield fail("Element must satisfy schema");
    }
  });
}

export function union<P extends Provable<unknown>>(
  schemas: readonly P[],
): Schema<P> {
  return new Prover(function* (value) {
    const valid = schemas.some((schema) => is(schema, value));

    if (!valid) {
      yield fail(`Satisfy one or more prove.`);
    }
  });
}

export function partial<T extends P, P>(
  schema: Provable<T, P>,
): Provable<Partial<T>> {
  return new Prover(function* (value) {
    for (const failure of schema.proof(value as P)) {
      if (failure.causedBy !== "has") {
        yield failure;
      }
    }
  });
}

export function record<K extends string, V>(
  key: Provable<K, {}>,
  value: Provable<V>,
): Provable<Record<K, V>, {}> {
  return new Prover<Record<K, V>, {}>(function* (input) {
    for (const k in input) {
      yield* key.proof(k);
      yield* value.proof(input[k as keyof {}]);
    }
  });
}
