import { Definable, Struct, StructMap } from "./types.ts";
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
import {
  Construct,
  constructorName,
  formatActExp,
  formatType,
} from "./utils.ts";
import { or } from "./operators.ts";

/** Create `string` data type struct.
 * @example
 * ```ts
 * import { is, string } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(string(), ""), true);
 * assertEquals(is(string(), 0), false);
 * ```
 */
export function string(): Struct<unknown, string> {
  return new Construct("string", function* (input) {
    if (!isString(input)) {
      yield { message: formatActExp("string", typeof input) };
    }
  });
}

/** Create `number` data type struct.
 * @example
 * ```ts
 * import { is, number } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(number(), 0), true);
 * assertEquals(is(number(), ""), false);
 * ```
 */
export function number(): Struct<unknown, number> {
  return new Construct("number", function* (input) {
    if (!isNumber(input)) {
      yield { message: formatActExp("number", typeof input) };
    }
  });
}

/** Create `bigint` data type struct.
 * @example
 * ```ts
 * import { bigint, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(bigint(), 0), true);
 * assertEquals(is(bigint(), 0n), false);
 * ```
 */
export function bigint(): Struct<unknown, bigint> {
  return new Construct("bigint", function* (input) {
    if (!isBigint(input)) {
      yield { message: formatActExp("bigint", typeof input) };
    }
  });
}

/** Create `boolean` data type struct.
 * @example
 * ```ts
 * import { boolean, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(boolean(), true), true);
 * assertEquals(is(boolean(), ""), false);
 * ```
 */
export function boolean(): Struct<unknown, boolean> {
  return new Construct("boolean", function* (input) {
    if (!isBoolean(input)) {
      yield { message: formatActExp("boolean", typeof input) };
    }
  });
}

/** Create `function` data type struct.
 * @example
 * ```ts
 * import { func, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(func(), () => {}), true);
 * assertEquals(is(func(), {}), false);
 * ```
 */
export function func(): Struct<unknown, Function> {
  return new Construct("func", function* (input) {
    if (!isFunction(input)) {
      yield { message: formatActExp("function", typeof input) };
    }
  });
}

/** Create `symbol` data type struct.
 * @example
 * ```ts
 * import { is, symbol } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(symbol(), Symbol.iterator), true);
 * assertEquals(is(symbol(), {}), false);
 * ```
 */
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

/** Create `object` data type struct. Treat `null` as not an `object`.
 * @example
 * ```ts
 * import {
 *   is,
 *   object,
 *   string,
 * } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(object(), {}), true);
 * assertEquals(
 *   is(object({ title: string(), postBy: object({ name: string() }) }), {
 *     title: "Diary of Anne Frank",
 *     postBy: { name: "Anne Frank" },
 *   }),
 *   true,
 * );
 * ```
 */
export function object<S extends StructMap>(
  structMap: S,
): Struct<unknown, S & Record<PropertyKey, unknown>> & Definable<S>;
export function object(): Struct<unknown, object>;
export function object(structMap?: StructMap): Struct<unknown, object> {
  const check = new Construct<unknown, StructMap>(
    "object",
    function* (input) {
      if (!isObject(input)) {
        return yield { message: formatActExp("object", formatType(input)) };
      }

      for (const key in structMap) {
        if (!hasOwn(key, input)) {
          yield { message: "property does not exist", paths: [key] };
          continue;
        }

        for (
          const { message, paths: _ = [] } of structMap[key].check(input?.[key])
        ) {
          const paths = [key].concat(_);
          yield { message, paths };
        }
      }
    },
  );

  return Object.assign(check, { definition: structMap });
}

export function list<S>(struct: Struct<unknown, S>): Struct<unknown, S[]> {
  return new Construct("list", function* (input) {
    if (!Array.isArray(input)) {
      return yield { message: formatActExp("Array", constructorName(input)) };
    }

    for (const key in input) {
      for (const { message, paths: _ = [] } of struct.check(input[key])) {
        const paths = [key].concat(_);
        yield { message, paths };
      }
    }
  });
}

/** Create `any[]` data type struct.
 * @example
 * ```ts
 * import { array, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(array(), [], true));
 * assertEquals(is(array(), {}, false));
 * ```
 */
export function array(): Struct<unknown, any[]> {
  return new Construct("array", function* (input) {
    if (!Array.isArray(input)) {
      return yield { message: formatActExp("Array", constructorName(input)) };
    }
  });
}

export function tuple<F, R extends readonly Struct<unknown>[]>(
  structs: [Struct<F>, ...R],
): Struct<unknown, [F, ...R]> {
  return new Construct("tuple", function* (input) {
    if (!Array.isArray(input)) {
      return yield { message: formatActExp("Array", constructorName(input)) };
    }

    const length = Math.max(structs.length, input.length);

    for (let i = 0; i < length; i++) {
      const key = i.toString();

      if (i in structs) {
        for (const { message, paths: _ = [] } of structs[i].check(input[i])) {
          const paths = [key].concat(_);
          yield { message, paths };
        }
      } else {
        yield { message: formatActExp("never", input[i]), paths: [key] };
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
    function* (input) {
      if (typeof input !== "object") return;
      for (const k in input) {
        yield* key.check(k);
        yield* value.check(input[k as keyof {}]);
      }
    },
  );
}

export function partial<S extends StructMap>(
  struct: Struct<unknown, S> & Definable<S>,
): Struct<unknown, Partial<S>> & Definable<Partial<S>> {
  const definition: Partial<S> = {};

  for (const key in struct.definition) {
    (definition as Writeable<StructMap>)[key] = or(
      literal(undefined),
    ).or(struct.definition[key]);
  }

  const check = new Construct<unknown, Partial<S>>(
    "partial",
    function* (input) {
      if (!isObject(input)) {
        return yield { message: formatActExp("object", formatType(input)) };
      }

      for (const key in struct.definition) {
        if (!hasOwn(key, input) || isUndefined(input[key])) continue;

        for (
          const { message, paths: _ = [] } of struct.definition[key].check(
            input[key],
          )
        ) {
          const paths = [...key, ..._];
          yield { message, paths };
        }
      }
    },
  );

  return Object.assign(check, { definition });
}

export function pick<U extends StructMap, K extends keyof U>(
  struct: Struct<unknown, U> & Definable<U>,
  ...keys: K[]
): Struct<unknown, Pick<U, K>> {
  const schema = keys.reduce((acc, key) => {
    acc[key] = struct.definition[key];

    return acc;
  }, {} as Pick<U, K>);

  return object<Pick<U, K>>(schema);
}

export function omit<S extends StructMap, K extends keyof S>(
  struct: Struct<unknown, S> & Definable<S>,
  ...keys: K[]
): Struct<unknown, Omit<S, K>> {
  const { definition } = struct;

  for (const key of keys) {
    delete definition[key];
  }

  return object(definition);
}
