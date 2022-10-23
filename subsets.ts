import { Construct, formatActExp } from "./utils.ts";
import { Struct } from "./types.ts";

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

export function maxSize(size: number): Struct<Iterable<unknown>> {
  return new Construct("maxSize", function* (input) {
    const length = [...input].length;
    if (size < length) {
      yield {
        message: formatActExp(
          `less than or equal to ${size} elements`,
          `${length} elements`,
        ),
      };
    }
  });
}

export function minSize(size: number): Struct<Iterable<unknown>> {
  return new Construct("minSize", function* (input) {
    const length = [...input].length;
    if (size > length) {
      yield {
        message: formatActExp(
          `greater than or equal to ${size} elements`,
          `${length} elements`,
        ),
      };
    }
  });
}
