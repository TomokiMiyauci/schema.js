import { Definable, ObjectSchema, Struct } from "./types.ts";
import {
  hasOwn,
  isBigint,
  isBoolean,
  isFunction,
  isNumber,
  isObject,
  isString,
  isSymbol,
  isUndefined,
  Writeable,
} from "./deps.ts";
import { Construct, constructorName, formatActExp } from "./utils.ts";
import { or } from "./operators.ts";

/** Create `string` data type struct. */
export function string(): Struct<unknown, string> {
  return new Construct("string", function* (input) {
    if (!isString(input)) {
      yield { message: formatActExp("string", typeof input) };
    }
  });
}

/** Create `number` data type struct. */
export function number(): Struct<unknown, number> {
  return new Construct("number", function* (input) {
    if (!isNumber(input)) {
      yield { message: formatActExp("number", typeof input) };
    }
  });
}

/** Create `bigint` data type struct. */
export function bigint(): Struct<unknown, bigint> {
  return new Construct("bigint", function* (input) {
    if (!isBigint(input)) {
      yield { message: formatActExp("bigint", typeof input) };
    }
  });
}

/** Create `boolean` data type struct. */
export function boolean(): Struct<unknown, boolean> {
  return new Construct("boolean", function* (input) {
    if (!isBoolean(input)) {
      yield { message: formatActExp("boolean", typeof input) };
    }
  });
}

/** Create `function` data type struct. */
export function func(): Struct<unknown, Function> {
  return new Construct("func", function* (input) {
    if (!isFunction(input)) {
      yield { message: formatActExp("function", typeof input) };
    }
  });
}

/** Create `symbol` data type struct. */
export function symbol(): Struct<unknown, symbol> {
  return new Construct("symbol", function* (input) {
    if (!isSymbol(input)) {
      yield { message: formatActExp("symbol", typeof input) };
    }
  });
}

export function literal<
  T extends string | number | bigint | null | undefined | symbol | boolean,
>(
  value: T,
): Struct<unknown, T> {
  return new Construct("literal", function* (input) {
    if (!Object.is(input, value)) {
      yield { message: formatActExp(value, input) };
    }
  });
}

/** Create `object` data type struct.
 * `null` is not object.
 */
export function object<S extends ObjectSchema>(
  schema: S,
): Struct<unknown, S> & Definable<S> {
  const knowns = Object.keys(schema);

  const check = new Construct<unknown, S>("object", function* (input, context) {
    if (!isObject(input)) {
      return yield {
        message: formatActExp("object", input === null ? "null" : typeof input),
      };
    }

    for (const key in schema) {
      const paths = context.paths.concat(key);

      if (!hasOwn(key, input)) {
        yield { message: "property does not exist", paths };
        continue;
      }

      yield* schema[key].check(input[key], { paths });

      for (const key in input) {
        if (knowns.includes(key)) continue;

        const paths = context.paths.concat(key);

        yield { message: formatActExp("never", input[key]), paths };
      }
    }
  });

  return Object.assign(check, { definition: schema });
}

export function list<S>(
  struct: Struct<S>,
): Struct<unknown, S[]> {
  return new Construct("list", function* (input, context) {
    if (!Array.isArray(input)) {
      return yield { message: formatActExp("Array", constructorName(input)) };
    }

    for (const key in input) {
      const paths = context.paths.concat(key);
      yield* struct.check(input[key], { paths });
    }
  });
}

export function tuple<F, R extends readonly Struct<unknown>[]>(
  structs: [Struct<F>, ...R],
): Struct<unknown, [F, ...R]> {
  return new Construct("tuple", function* (input, context) {
    if (!Array.isArray(input)) {
      return yield { message: formatActExp("Array", constructorName(input)) };
    }

    const length = Math.max(structs.length, input.length);

    for (let i = 0; i < length; i++) {
      const paths = context.paths.concat(i.toString());

      if (i in structs) {
        yield* structs[i].check(input[i], { paths });
      } else {
        yield { message: formatActExp("never", input[i]), paths };
      }
    }
  });
}

export function record<K extends string, V>(
  key: Struct<unknown, K>,
  value: Struct<unknown, V>,
): Struct<unknown, Record<K, V>> {
  return new Construct<unknown, Record<K, V>>(
    "record",
    function* (input, context) {
      if (typeof input !== "object") return;
      for (const k in input) {
        yield* key.check(k, context);
        yield* value.check(input[k as keyof {}], context);
      }
    },
  );
}

export function partial<S extends ObjectSchema>(
  struct: Struct<unknown, S> & Definable<S>,
): Struct<unknown, Partial<S>> & Definable<Partial<S>> {
  const definition: Partial<S> = {};

  for (const key in struct.definition) {
    (definition as Writeable<ObjectSchema>)[key] = or(
      literal(undefined),
    ).or(struct.definition[key]);
  }

  const check = new Construct<unknown, Partial<S>>(
    "partial",
    function* (input, context) {
      if (!isObject(input)) {
        return yield {
          message: `expected object, actual ${typeof input}`,
          ...context,
        };
      }

      for (const key in struct.definition) {
        if (!hasOwn(key, input) || isUndefined(input[key])) continue;

        const paths = context.paths.concat(key);

        yield* struct.definition[key].check(input[key], { paths });
      }
    },
  );

  return Object.assign(check, { definition });
}

export function pick<U extends ObjectSchema, K extends keyof U>(
  struct: Struct<unknown, U> & Definable<U>,
  ...keys: K[]
): Struct<unknown, Pick<U, K>> {
  const schema = keys.reduce((acc, key) => {
    acc[key] = struct.definition[key];

    return acc;
  }, {} as Pick<U, K>);

  return object<Pick<U, K>>(schema);
}

export function omit<S extends ObjectSchema, K extends keyof S>(
  struct: Struct<unknown, S> & Definable<S>,
  ...keys: K[]
): Struct<unknown, Omit<S, K>> {
  const { definition } = struct;

  for (const key of keys) {
    delete definition[key];
  }

  return object(definition);
}
