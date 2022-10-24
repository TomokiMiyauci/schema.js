import { Construct, formatActExp, formatPlural } from "./utils.ts";
import { Struct } from "./types.ts";
import { getSize } from "./deps.ts";

export function maximum(max: number): Struct<number> {
  return new Construct("maximum", function* (input) {
    if (max < input) {
      yield {
        message: formatActExp(`less than or equal to ${max}`, input),
      };
    }
  });
}

export function minimum(min: number): Struct<number> {
  return new Construct("minimum", function* (input) {
    if (min > input) {
      yield { message: formatActExp(`greater than or equal to ${min}`, input) };
    }
  });
}

/** Create max size struct. Sets the maximum number of elements.
 * @param size Maximum size of elements.
 *
 * @example
 * ```ts
 * import { is, maxSize } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(maxSize(10), "typestruct"), true);
 * assertEquals(is(maxSize(4), new Array(5)), false);
 * ```
 */
export function maxSize(size: number): Struct<Iterable<unknown>> {
  return new Construct("maxSize", function* (input) {
    const length = [...input].length;
    if (size < length) {
      yield {
        message: formatActExp(
          `less than or equal to ${formatPlural("element", size)}`,
          formatPlural("element", length),
        ),
      };
    }
  });
}

/** Create min size struct. Sets the minimum number of elements.
 * @param size Minimum size of elements.
 *
 * @example
 * ```ts
 * import { is, minSize } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(minSize(10), "typestruct"), true);
 * assertEquals(is(minSize(10), new Array(5)), false);
 * ```
 */
export function minSize(size: number): Struct<Iterable<unknown>> {
  return new Construct("minSize", function* (input) {
    const length = [...input].length;
    if (size > length) {
      yield {
        message: formatActExp(
          `greater than or equal to ${formatPlural("element", size)}`,
          formatPlural("element", length),
        ),
      };
    }
  });
}

/** Create empty struct. Empty means there are no elements.
 *
 * @example
 * ```ts
 * import { empty, is } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(empty(), ""), true);
 * assertEquals(is(empty(), [1]), false);
 * ```
 */
export function empty(): Struct<Iterable<unknown>> {
  return new Construct("empty", function* (input) {
    const size = getSize(input);
    if (size) {
      yield { message: formatActExp("empty", formatPlural("element", size)) };
    }
  });
}

/** Create non empty struct. Non empty meas there are more than one element.
 *
 * @example
 * ```ts
 * import { is, nonempty } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(nonempty(), new Set([1, 2, 3])), true);
 * assertEquals(is(nonempty(), new Map(), false);
 * ```
 */
export function nonempty(): Struct<Iterable<unknown>> {
  return new Construct("empty", function* (input) {
    const size = getSize(input);
    if (!size) {
      yield { message: formatActExp("non empty", `empty`) };
    }
  });
}
