// Copyright 2022-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { Definable, Struct, StructMap } from "../types.ts";
import {
  isBigint,
  isBoolean,
  isFunction,
  isNumber,
  isObject,
  isString,
  isSymbol,
} from "../deps.ts";
import {
  Construct,
  constructorName,
  formatActExp,
  formatType,
  mergeIssuePaths,
} from "../utils.ts";

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
export function array(message?: string): Struct<unknown, unknown[]> {
  return new Construct("array", function* (input) {
    if (!Array.isArray(input)) {
      return yield {
        message: message ?? formatActExp("Array", constructorName(input)),
      };
    }
  });
}

/** Create `instanceof` struct. Ensure that the input is an instance of a defined
 * constructor.
 * @param constructor Any constructor.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { instance, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(instance(Array), []), true);
 * assertEquals(is(instance(class Any {}), null), false);
 * ```
 */
export function instance<T extends abstract new (...args: any) => any>(
  constructor: T,
  message?: string,
): Struct<unknown, InstanceType<T>> {
  return new Construct("instance", function* (input) {
    if (!(input instanceof constructor)) {
      yield {
        message: message ??
          formatActExp(
            `instance of ${constructor.name}`,
            constructorName(input),
          ),
      };
    }
  });
}
