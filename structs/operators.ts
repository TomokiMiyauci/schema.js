// Copyright 2022-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { Checkable, Issue, Struct } from "../types.ts";
import { Construct, formatActExp } from "../utils.ts";
import { IsTopType, iter, PartialBy } from "../deps.ts";

/** Union type API. */
export interface Union<In, Out extends In> {
  or: <T extends In>(
    struct: Struct<In, T>,
  ) => Struct<In, Out | T> & Union<In, Out | T>;
}

/** Intersection type API. */
export interface Intersection<In, Out extends In> {
  and: <T extends Out>(
    struct: Struct<Out, T>,
  ) => IsTopType<T> extends true ? Struct<In, Out> & Intersection<In, Out>
    : Struct<In, T> & Intersection<In, T>;
}

/** Create union struct.
 * @param struct Any struct.
 * @example
 * ```ts
 * import {
 *   is,
 *   number,
 *   or,
 *   string,
 * } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const StrOrNum = or(string()).or(number());
 * assertEquals(is(StrOrNum, ""), true);
 * assertEquals(is(StrOrNum, 0), true);
 * assertEquals(is(StrOrNum, {}), false);
 * ```
 */
export function or<In, Out extends In>(
  struct: Struct<In, Out>,
): Struct<In, Out> & Union<In, Out> {
  class UnionStruct implements Struct<In, Out> {
    constructor(private structs: Struct<any, any>[]) {}

    *check(input: In): Iterable<PartialBy<Issue, "paths">> {
      for (const struct of this.structs) {
        const issues = [...struct.check(input)];

        if (!issues.length) return;
      }

      yield { message: formatActExp(this.toString(), input) };
    }

    toString(): string {
      const name = this.structs.join(" | ");
      return `(${name})`;
    }

    declare [Struct.type]: Out;

    or = <T extends In>(struct: Struct<In, T>): UnionStruct => {
      return new UnionStruct([...this.structs, struct]);
    };
  }

  return new UnionStruct([struct]);
}

/** Create intersection struct. Ensure all structures satisfy.
 * @param struct Any struct.
 * @example
 * ```ts
 * import {
 *   and,
 *   is,
 *   maxSize,
 *   minSize,
 *   string,
 * } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const String5_10 = and(string()).and(minSize(5)).and(maxSize(10));
 *
 * assertEquals(is(String5_10, "typestruct"), true);
 * assertEquals(is(String5_10, ""), false);
 * ```
 */
export function and<In, Out extends In>(
  struct: Struct<In, Out>,
): Struct<In, Out> & Intersection<In, Out> {
  class IntersectionStruct<In, Out extends In>
    implements Checkable<In, Out>, Intersection<In, Out> {
    constructor(private structs: Struct<any, any>[]) {}

    and<T extends Out>(struct: Struct<Out, T>): IntersectionStruct<In, T> {
      return new IntersectionStruct([...this.structs, struct]);
    }

    *check(input: In): Iterable<PartialBy<Issue, "paths">> {
      for (const struct of this.structs) {
        const iterator = iter(struct.check(input));
        const { done, value } = iterator.next();

        if (!done) {
          yield value;
          break;
        }
      }
    }

    toString(): string {
      const name = this.structs.join(" & ");
      return `(${name})`;
    }

    declare [Struct.type]: Out;
  }

  return new IntersectionStruct<In, Out>([struct]);
}

/** Create inversion struct. Ensure the structure is not satisfied.
 * @param struct Any struct.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import {
 *   is,
 *   not,
 *   string,
 * } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const NotString = not(string());
 * assertEquals(is(NotString, 0), true);
 * assertEquals(is(NotString, "typestruct"), false);
 * ```
 */
export function not<In, Out extends In>(
  struct: Struct<In, Out>,
  message?: string,
): Struct<In, Out> {
  return new Construct(`not(${struct})`, function* (input) {
    const valid = !([...struct.check(input)].length);

    if (valid) {
      yield { message: message ?? formatActExp(`not ${struct}`, input) };
    }
  });
}
