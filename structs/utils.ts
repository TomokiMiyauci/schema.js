// Copyright 2022-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { object, value } from "./cores.ts";
import { or } from "./operators.ts";
import { Definable, Struct, StructMap } from "../types.ts";
import {
  Construct,
  formatActExp,
  formatType,
  mergeIssuePaths,
} from "../utils.ts";
import { isObject, Writeable } from "../deps.ts";

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
