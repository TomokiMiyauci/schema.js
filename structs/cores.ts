// Copyright 2022-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import {
  ConstructorContext,
  DataType,
  DataTypeContext,
  Definable,
  Issue,
  Messenger,
  ResultContext,
  Struct,
  StructMap,
} from "../types.ts";
import { isObject, isString, PartialBy } from "../deps.ts";
import {
  Construct,
  constructorName,
  formatActExp,
  mergeIssuePaths,
  resolveMessage,
  show,
  typeOf,
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
export function string(
  message?: string | Messenger<DataTypeContext>,
): Struct<unknown, string> {
  const type = "string";
  return new Construct(type, createTypeCheck(type, message));
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
export function number(
  message?: string | Messenger<DataTypeContext>,
): Struct<unknown, number> {
  const type = "number";
  return new Construct(type, createTypeCheck(type, message));
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
export function bigint(
  message?: string | Messenger<DataTypeContext>,
): Struct<unknown, bigint> {
  const type = "bigint";
  return new Construct(type, createTypeCheck(type, message));
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
export function boolean(
  message?: string | Messenger<DataTypeContext>,
): Struct<unknown, boolean> {
  const type = "boolean";
  return new Construct(type, createTypeCheck(type, message));
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
export function func(
  message?: string | Messenger<DataTypeContext>,
): Struct<unknown, Function> {
  return new Construct("func", createTypeCheck("function", message));
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
export function symbol(
  message?: string | Messenger<DataTypeContext>,
): Struct<unknown, symbol> {
  const type = "symbol";
  return new Construct(type, createTypeCheck(type, message));
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
  message?: string | Messenger<ResultContext>,
): Struct<unknown, T> {
  return new Construct(String(primitive), function* (input) {
    if (!Object.is(input, primitive)) {
      const msg = resolveMessage(message ?? format, {
        actual: input,
        expected: primitive,
      });

      yield { message: msg };
    }
  });
}

/** Create object literal struct. Additional properties will ignore.
 * @param structMap Struct map.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import {
 *   is,
 *   object,
 *   string,
 * } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const Book = object({
 *   title: string(),
 *   postBy: object({
 *     name: string(),
 *   }),
 * });
 *
 * assertEquals(
 *   is(Book, {
 *     title: "Diary of Anne Frank",
 *     postBy: { name: "Anne Frank" },
 *   }),
 *   true,
 * );
 * ```
 */
export function object<S extends StructMap>(
  structMap: S,
  message?: string,
): Struct<unknown, S & Record<PropertyKey, unknown>> & Definable<S>;
/** Create `object` data type struct. Treat `null` as not an `object`.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, object } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(object(), {}), true);
 * assertEquals(is(object(), null), false);
 * ```
 */
export function object(message?: string): Struct<unknown, object>;
export function object(
  structMapOrMessage?: StructMap | string,
  messageOr?: string,
): Struct<unknown, object> {
  const { message, structMap } = resolveArgs(
    structMapOrMessage,
    messageOr,
  );
  const type = "object";

  const check = new Construct<unknown, StructMap>(
    type,
    function* (input) {
      if (typeOf(input) !== type) {
        return yield {
          message: message ?? formatActExp(type, typeOf(input)),
        };
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

function resolveArgs(
  structMapOrMessage?: StructMap | string,
  messageOr?: string,
): {
  structMap: StructMap;
  message: string | undefined;
} {
  const structMap = isObject(structMapOrMessage) ? structMapOrMessage : {};
  const message = isString(structMapOrMessage)
    ? structMapOrMessage
    : (isString(messageOr) ? messageOr : undefined);

  return { structMap, message };
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
export function array(
  message?: string | Messenger<ConstructorContext>,
): Struct<unknown, unknown[]> {
  const struct = instance(Array, message);

  return Object.assign(struct, { toString: () => "array" });
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
  message?: string | Messenger<ConstructorContext>,
): Struct<unknown, InstanceType<T>> {
  return new Construct("instance", function* (input) {
    if (!(input instanceof constructor)) {
      const msg = resolveMessage(message ?? formatConstructor, {
        expected: constructor,
        actual: input,
      });
      yield { message: msg };
    }
  });
}

function format(
  { actual, expected }: ResultContext,
): string {
  return formatActExp(show(expected), show(actual));
}

function formatDataType({ actual, expected }: DataTypeContext): string {
  return formatActExp(expected, typeOf(actual));
}

function formatConstructor({ actual, expected }: ConstructorContext) {
  return formatActExp(`instance of ${expected.name}`, constructorName(actual));
}

function createTypeCheck(
  type: DataType,
  messenger?: string | Messenger<DataTypeContext>,
): (input: unknown) => Generator<PartialBy<Issue, "paths">, void, unknown> {
  return function* (input) {
    if (typeOf(input) === type) return;

    const message = resolveMessage(
      messenger ?? formatDataType,
      { actual: input, expected: type },
    );

    yield { message };
  };
}
