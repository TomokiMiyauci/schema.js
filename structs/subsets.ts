// Copyright 2022-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import {
  Construct,
  formatActExp,
  formatMessage,
  formatPlural,
  resolveMessage,
} from "../utils.ts";
import { Messenger, ResultContext, Struct } from "../types.ts";
import {
  getSize,
  isNegativeNumber,
  isNonNegativeNumber,
  isNonPositiveNumber,
  isPositiveNumber,
  isValidDate,
} from "../deps.ts";

/** Create maximum struct. Ensure the input less than or equal to threshold.
 * @param threshold
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, maximum } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(maximum(5), 5), true);
 * assertEquals(is(maximum(5), 6), false);
 * ```
 */
export function maximum<T>(
  threshold: T,
  message?: string | Messenger<ResultContext<T>>,
): Struct<T> {
  return new Construct("maximum", function* (input) {
    if (threshold < input) {
      const msg = resolveMessage(message ?? formatMessage, {
        actual: input,
        expected: `less than or equal to ${threshold}`,
      });
      yield { message: msg };
    }
  });
}

/** Create minimum struct. Ensure the input grater than or equal to threshold.
 * @param threshold
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, minimum } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(minimum(5), 5), true);
 * assertEquals(is(minimum(5), 4), false);
 * ```
 */
export function minimum<T>(
  threshold: T,
  message?: string | Messenger<ResultContext<T>>,
): Struct<T> {
  return new Construct("minimum", function* (input) {
    if (threshold > input) {
      const msg = resolveMessage(message ?? formatMessage, {
        actual: input,
        expected: `greater than or equal to ${threshold}`,
      });

      yield { message: msg };
    }
  });
}

/** Create max size struct. Sets the maximum number of elements.
 * @param size Maximum size of elements.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, maxSize } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(maxSize(10), "typestruct"), true);
 * assertEquals(is(maxSize(4), new Array(5)), false);
 * ```
 */
export function maxSize(
  size: number,
  message?: string | Messenger<ResultContext>,
): Struct<Iterable<unknown>> {
  return new Construct("maxSize", function* (input) {
    const length = getSize(input);
    if (size < length) {
      const msg = resolveMessage(message ?? formatMessage, {
        actual: formatPlural("element", length),
        expected: `less than or equal to ${formatPlural("element", size)}`,
      });
      yield { message: msg };
    }
  });
}

/** Create min size struct. Sets the minimum number of elements.
 * @param size Minimum size of elements.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, minSize } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(minSize(10), "typestruct"), true);
 * assertEquals(is(minSize(10), new Array(5)), false);
 * ```
 */
export function minSize(
  size: number,
  message?: string,
): Struct<Iterable<unknown>> {
  return new Construct("minSize", function* (input) {
    const length = getSize(input);
    if (size > length) {
      yield {
        message: message ?? formatActExp(
          `greater than or equal to ${formatPlural("element", size)}`,
          formatPlural("element", length),
        ),
      };
    }
  });
}

/** Create size struct. Ensure the number of elements.
 * @param size Element size.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, size } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(size(10), "typestruct"), true);
 * assertEquals(is(size(1), new Set()), false);
 * ```
 */
export function size(
  size: number,
  message?: string,
): Struct<Iterable<unknown>> {
  return new Construct("size", function* (input) {
    const length = getSize(input);

    if (size !== length) {
      yield {
        message: message ??
          formatActExp(
            formatPlural("element", size),
            formatPlural("element", length),
          ),
      };
    }
  });
}

/** Create empty struct. Empty means there are no elements.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { empty, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(empty(), ""), true);
 * assertEquals(is(empty(), [1]), false);
 * ```
 */
export function empty(
  message?: string | Messenger<ResultContext<Iterable<unknown>>>,
): Struct<Iterable<unknown>> {
  return new Construct("empty", function* (input) {
    const size = getSize(input);
    if (size) {
      const msg = resolveMessage(message ?? formatIterable, {
        actual: input,
        expected: "empty",
      });

      yield { message: msg };
    }
  });
}

/** Create non empty struct. Non empty meas there are more than one element.
 * @param message Custom issue message
 * @example
 * ```ts
 * import { is, nonempty } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(nonempty(), new Set([1, 2, 3])), true);
 * assertEquals(is(nonempty(), new Map()), false);
 * ```
 */
export function nonempty(
  message?: string | Messenger<ResultContext<Iterable<unknown>>>,
): Struct<Iterable<unknown>> {
  return new Construct("empty", function* (input) {
    const size = getSize(input);
    if (!size) {
      const msg = resolveMessage(message ?? formatIterable, {
        actual: input,
        expected: "non-empty",
      });
      yield { message: msg };
    }
  });
}

/** Create pattern struct. Ensure the input match to the pattern.
 * @param regexp `RegExp` pattern
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, pattern } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(pattern(/type/), "typescript"), true);
 * assertEquals(is(pattern(/type/), "javascript"), false);
 * ```
 */
export function pattern(regexp: RegExp, message?: string): Struct<string> {
  return new Construct("pattern", function* (input) {
    if (!regexp.test(input)) {
      yield {
        message: message ?? formatActExp(`match ${regexp}`, "not match"),
      };
    }
  });
}

/** Create list struct. List is array subtype. Ensure that all elements are same
 * type.
 * @param struct
 * @example
 * ```ts
 * import { is, list, and, array, number, string } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(list(string()), ["typescript", "javascript"]), true);
 * assertEquals(is(and(array()).and(list(number())), [1, 2, 3]), true);
 * ```
 */
export function list<S>(
  struct: Struct<unknown, S>,
): Struct<readonly unknown[], S[]> {
  return new Construct("list", function* (input) {
    for (const key in input) {
      for (const { message, paths: _ = [] } of struct.check(input[key])) {
        const paths = [key].concat(_);
        yield { message, paths };
      }
    }
  });
}

/** Create tuple struct. Tuple is array subtype. Ensure that the position and type
 * of the elements match.
 * @param structs
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, tuple, and, array, number, string, object } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const Tuple = tuple([string(), number(), object()]);
 *
 * assertEquals(is(Tuple, ["", 0, {}]), true);
 * assertEquals(is(and(array()).and(Tuple), [1, 2, 3] as unknown), true);
 * ```
 */
export function tuple<F, R extends readonly Struct<unknown>[]>(
  structs: [Struct<unknown, F>, ...R],
  message?: string,
): Struct<readonly unknown[], [F, ...R]> {
  return new Construct("tuple", function* (input) {
    const length = Math.max(structs.length, input.length);

    for (let i = 0; i < length; i++) {
      const key = i.toString();

      if (i in structs) {
        for (const { message, paths: _ = [] } of structs[i].check(input[i])) {
          const paths = [key].concat(_);
          yield { message, paths };
        }
      } else {
        yield {
          message: message ?? formatActExp("never", input[i]),
          paths: [key],
        };
      }
    }
  });
}

/** Create integer struct. Ensure the input is integer.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { int, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(int(), 1.0), true);
 * assertEquals(is(int(), 1.1), false);
 * ```
 */
export function int(message?: string): Struct<number> {
  return new Construct("int", function* (input) {
    if (!Number.isInteger(input)) {
      yield { message: message ?? formatActExp("integer", input) };
    }
  });
}

/** Create positive number struct. Ensure the input is positive number.
 * Positive number means greater than zero.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, positive } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(positive(), 0.1), true);
 * assertEquals(is(positive(), 0), false);
 * ```
 */
export function positive(message?: string): Struct<number> {
  return new Construct("positive", function* (input) {
    if (!isPositiveNumber(input)) {
      yield { message: message ?? formatActExp("positive number", input) };
    }
  });
}

/** Create non-positive value struct. Ensure the input is non-positive number.
 * Non-positive number means less than or equal to zero.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import {
 *   is,
 *   nonpositive,
 * } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(nonpositive(), 0), true);
 * assertEquals(is(nonpositive(), -1), true);
 * assertEquals(is(nonpositive(), 1), false);
 * ```
 */
export function nonpositive(message?: string): Struct<number> {
  return new Construct("nonpositive", function* (input) {
    if (!isNonPositiveNumber(input)) {
      yield { message: message ?? formatActExp("non-positive number", input) };
    }
  });
}

/** Create `NaN` struct. Ensure the input is `NaN`.
 * @message Custom issue message.
 * @example
 * ```ts
 * import { is, nan } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(nan(), NaN), true);
 * assertEquals(is(nan(), 0), false);
 * ```
 */
export function nan(message?: string): Struct<number> {
  return new Construct("nan", function* (input) {
    if (!Number.isNaN(input)) {
      return yield { message: message ?? formatActExp(NaN, input) };
    }
  });
}

/** Create negative number struct. Ensure the input is negative number.
 * Negative number means a number less than zero.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, negative } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(negative(), -0.1), true);
 * assertEquals(is(negative(), 0), false);
 * ```
 */
export function negative(message?: string): Struct<number> {
  return new Construct("negative", function* (input) {
    if (!isNegativeNumber(input)) {
      yield { message: message ?? formatActExp("negative number", input) };
    }
  });
}

/** Create negative value struct. Ensure the input is non-negative number.
 * Non-negative number means greater than or equal to zero.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import {
 *   is,
 *   nonnegative,
 * } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(nonnegative(), 0), true);
 * assertEquals(is(nonnegative(), 1), true);
 * assertEquals(is(nonnegative(), -1), false);
 * ```
 */
export function nonnegative(message?: string): Struct<number> {
  return new Construct("nonnegative", function* (input) {
    if (!isNonNegativeNumber(input)) {
      yield { message: message ?? formatActExp("non-negative number", input) };
    }
  });
}

/** Create valid date struct. Ensure the input is valid date (non `NaN`) format.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, validDate } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(is(validDate(), new Date("2022-01-01")), true);
 * assertEquals(is(validDate(), new Date("invalid date")), false);
 * ```
 */
export function validDate(message?: string): Struct<Date> {
  return new Construct("validDate", function* (input) {
    if (!isValidDate(input)) {
      yield { message: message ?? formatActExp("valid date", "invalid date") };
    }
  });
}

function formatIterable(
  { actual, expected }: ResultContext<Iterable<unknown>>,
): string {
  return formatActExp(expected, formatPlural("element", getSize(actual)));
}
