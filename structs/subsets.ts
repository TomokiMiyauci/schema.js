import { Construct, formatActExp, formatPlural } from "../utils.ts";
import { Struct } from "../types.ts";
import { getSize } from "../deps.ts";

/** Create maximum struct. Ensure the input less than or equal to threshold.
 * @param threshold
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, maximum } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(maximum(5), 5), true);
 * assertEquals(is(maximum(5), 6), false);
 * ```
 */
export function maximum(threshold: number, message?: string): Struct<number> {
  return new Construct("maximum", function* (input) {
    if (threshold < input) {
      yield {
        message: message ??
          formatActExp(`less than or equal to ${threshold}`, input),
      };
    }
  });
}

/** Create minimum struct. Ensure the input grater than or equal to threshold.
 * @param threshold
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, minimum } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(minimum(5), 5), true);
 * assertEquals(is(minimum(5), 4), false);
 * ```
 */
export function minimum(threshold: number, message?: string): Struct<number> {
  return new Construct("minimum", function* (input) {
    if (threshold > input) {
      yield {
        message: message ??
          formatActExp(`greater than or equal to ${threshold}`, input),
      };
    }
  });
}

/** Create max size struct. Sets the maximum number of elements.
 * @param size Maximum size of elements.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, maxSize } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(maxSize(10), "typestruct"), true);
 * assertEquals(is(maxSize(4), new Array(5)), false);
 * ```
 */
export function maxSize(
  size: number,
  message?: string,
): Struct<Iterable<unknown>> {
  return new Construct("maxSize", function* (input) {
    const length = [...input].length;
    if (size < length) {
      yield {
        message: message ?? formatActExp(
          `less than or equal to ${formatPlural("element", size)}`,
          formatPlural("element", length),
        ),
      };
    }
  });
}

/** Create min size struct. Sets the minimum number of elements.
 * @param size Minimum size of elements.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, minSize } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
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
    const length = [...input].length;
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

/** Create empty struct. Empty means there are no elements.
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { empty, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(empty(), ""), true);
 * assertEquals(is(empty(), [1]), false);
 * ```
 */
export function empty(message?: string): Struct<Iterable<unknown>> {
  return new Construct("empty", function* (input) {
    const size = getSize(input);
    if (size) {
      yield {
        message: message ??
          formatActExp("empty", formatPlural("element", size)),
      };
    }
  });
}

/** Create non empty struct. Non empty meas there are more than one element.
 * @param message Custom issue message
 * @example
 * ```ts
 * import { is, nonempty } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(nonempty(), new Set([1, 2, 3])), true);
 * assertEquals(is(nonempty(), new Map(), false);
 * ```
 */
export function nonempty(message?: string): Struct<Iterable<unknown>> {
  return new Construct("empty", function* (input) {
    const size = getSize(input);
    if (!size) {
      yield { message: message ?? formatActExp("non empty", `empty`) };
    }
  });
}

/** Create pattern struct. Ensure the input match to the pattern.
 * @param regexp `RegExp` pattern
 * @param message Custom issue message.
 * @example
 * ```ts
 * import { is, pattern } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(pattern(/type/), "typescript", true);
 * assertEquals(is(pattern(/type/), "javascript", false);
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
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(list(string()), ["typescript", "javascript"], true);
 * assertEquals(is(and(array()).and(list(number())), [1, 2, 3] as unknown, true);
 * ```
 */
export function list<S>(struct: Struct<unknown, S>): Struct<any[], S[]> {
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
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(tuple([[string(), number(), object()]), ["", 0, {}], true);
 * assertEquals(is(and(array()).and(tuple([number(), number(), number()])), [1, 2, 3] as unknown, true);
 * ```
 */
export function tuple<F, R extends readonly Struct<unknown>[]>(
  structs: [Struct<unknown, F>, ...R],
  message?: string,
): Struct<any[], [F, ...R]> {
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
