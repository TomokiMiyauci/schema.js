import { Definable, Struct, StructMap } from "../types.ts";
import {
  isBigint,
  isBoolean,
  isFunction,
  isNumber,
  isObject,
  isString,
  isSymbol,
  Writeable,
} from "../deps.ts";
import {
  Construct,
  constructorName,
  formatActExp,
  formatType,
  mergeIssuePaths,
} from "../utils.ts";
import { or } from "./operators.ts";

/** Create `string` data type struct.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, string } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(string(), ""), true);
 * assertEquals(is(string(), 0), false);
 * ```
 */
export function string(message?: string): Struct<unknown, string> {
  return new Construct("string", function* (input) {
    if (!isString(input)) {
      yield { message: message ?? formatActExp("string", typeof input) };
    }
  });
}

/** Create `number` data type struct.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, number } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(number(), 0), true);
 * assertEquals(is(number(), ""), false);
 * ```
 */
export function number(message?: string): Struct<unknown, number> {
  return new Construct("number", function* (input) {
    if (!isNumber(input)) {
      yield { message: message ?? formatActExp("number", typeof input) };
    }
  });
}

/** Create `bigint` data type struct.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { bigint, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(bigint(), 0), true);
 * assertEquals(is(bigint(), 0n), false);
 * ```
 */
export function bigint(message?: string): Struct<unknown, bigint> {
  return new Construct("bigint", function* (input) {
    if (!isBigint(input)) {
      yield { message: message ?? formatActExp("bigint", typeof input) };
    }
  });
}

/** Create `boolean` data type struct.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { boolean, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(boolean(), true), true);
 * assertEquals(is(boolean(), ""), false);
 * ```
 */
export function boolean(message?: string): Struct<unknown, boolean> {
  return new Construct("boolean", function* (input) {
    if (!isBoolean(input)) {
      yield { message: message ?? formatActExp("boolean", typeof input) };
    }
  });
}

/** Create `function` data type struct.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { func, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(func(), () => {}), true);
 * assertEquals(is(func(), {}), false);
 * ```
 */
export function func(message?: string): Struct<unknown, Function> {
  return new Construct("func", function* (input) {
    if (!isFunction(input)) {
      yield { message: message ?? formatActExp("function", typeof input) };
    }
  });
}

/** Create `symbol` data type struct.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, symbol } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(symbol(), Symbol.iterator), true);
 * assertEquals(is(symbol(), {}), false);
 * ```
 */
export function symbol(message?: string): Struct<unknown, symbol> {
  return new Construct("symbol", function* (input) {
    if (!isSymbol(input)) {
      yield { message: message ?? formatActExp("symbol", typeof input) };
    }
  });
}

/** Create primitive value struct.
 * @param primitive Primitive value.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, value } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(value(null), null), true);
 * assertEquals(is(value(null), undefined), false);
 * ```
 */
export function value<
  T extends string | number | bigint | null | undefined | symbol | boolean,
>(
  primitive: T,
  message?: string,
): Struct<unknown, T> {
  return new Construct(String(primitive), function* (input) {
    if (!Object.is(input, primitive)) {
      yield { message: message ?? formatActExp(primitive, input) };
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
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
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

      // in operator will improve type inference in TypeScript v4.9
      for (const key in structMap) {
        yield* mergeIssuePaths(
          structMap[key]!.check((input as Record<any, unknown>)[key]),
          [key],
        );
      }
    },
  );

  return Object.assign(check, { definition: structMap });
}

/** Create `Array` data type struct.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { array, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(array(), []), true);
 * assertEquals(is(array(), {}), false);
 * ```
 */
export function array(message?: string): Struct<unknown, any[]> {
  return new Construct("array", function* (input) {
    if (!Array.isArray(input)) {
      return yield {
        message: message ?? formatActExp("Array", constructorName(input)),
      };
    }
  });
}

/** Create `Record` struct. Ensure the input is object, and keys and values satisfy
 * struct.
 * @param key - The key of struct.
 * @param value - The value of struct.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import {
 *   is,
 *   number,
 *   record,
 *   string,
 * } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const Record = record(string(), number()); // { [k: string]: number }
 * assertEquals(is(Record, { john: 80, tom: 100 }), true);
 * assertEquals(is(Record, { name: "john", hobby: "swimming" }), false);
 * ```
 */
export function record<K extends string, V>(
  key: Struct<unknown, K>,
  value: Struct<unknown, V>,
  message?: string,
): Struct<unknown, Record<K, V>> {
  return new Construct<unknown, Record<K, V>>(
    "record",
    function* (input) {
      if (!isObject(input)) {
        return yield {
          message: message ?? formatActExp("object", formatType(input)),
        };
      }
      for (const k in input) {
        yield* mergeIssuePaths(key.check(k), [k]);
        yield* mergeIssuePaths(value.check(input[k as keyof {}]), [k]);
      }
    },
  );
}

/** Create `Partial` struct. Make all properties in struct optional.
 * @param struct Definable struct.
 * @example
 * ```ts
 * import {
 *   is,
 *   object,
 *   partial,
 *   string,
 * } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const User = object({ id: string(), name: string() });
 *
 * assertEquals(is(User, {}), false);
 * assertEquals(is(partial(User), {}), true);
 * ```
 */
export function partial<S extends StructMap>(
  struct: Struct<unknown, S> & Definable<S>,
): Struct<unknown, Partial<S>> & Definable<Partial<S>> {
  const definition: Partial<S> = {};

  for (const key in struct.definition) {
    (definition as Writeable<StructMap>)[key] = or(
      value(undefined),
    ).or(struct.definition[key]!);
  }

  return object(definition as S);
}

/** Create `Pick` struct. From struct, pick a set of properties whose keys are in the definition.
 * @param struct Definable struct.
 * @param keys Pick properties.
 * @example
 * ```ts
 * import {
 *   is,
 *   object,
 *   pick,
 *   string,
 * } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const User = object({ id: string(), name: string() });
 * const data = { name: "tom" };
 *
 * assertEquals(is(User, data), false);
 * assertEquals(is(pick(User, ["name"]), data), true);
 * ```
 */
export function pick<U extends StructMap, K extends keyof U>(
  struct: Struct<unknown, U> & Definable<U>,
  keys: Iterable<K>,
): Struct<unknown, Pick<U, K>> & Definable<Pick<U, K>> {
  const structMap = Array.from(keys).reduce((acc, key) => {
    acc[key] = struct.definition[key];

    return acc;
  }, {} as Pick<U, K>);

  return object(structMap);
}

/** Create `Omit` struct. From struct, omit a set of properties whose keys are in the definition.
 * @param struct Definable struct.
 * @param keys Omit properties.
 * @example
 * ```ts
 * import {
 *   is,
 *   object,
 *   omit,
 *   string,
 * } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const User = object({ id: string(), name: string() });
 * const data = { name: "tom" };
 *
 * assertEquals(is(User, data), false);
 * assertEquals(is(omit(User, ["id"]), data), true);
 * ```
 */
export function omit<S extends StructMap, K extends keyof S>(
  struct: Struct<unknown, S> & Definable<S>,
  keys: Iterable<K>,
): Struct<unknown, Omit<S, K>> & Definable<Omit<S, K>> {
  const definition = { ...struct.definition };

  for (const key of keys) {
    delete definition[key];
  }

  return object(definition);
}
