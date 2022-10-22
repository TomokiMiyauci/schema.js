import { Struct } from "./types.ts";
import { Construct, formatActExp } from "./utils.ts";
import { prop, UnionToIntersection } from "./deps.ts";

/** Create union struct. */
export function or<S extends readonly Struct<unknown>[]>(
  ...structs: S
): Struct<S[number]> {
  const name = structs.map(prop(Symbol.toStringTag)).join(" | ");

  return new Construct(`(${name})`, function* (input, context) {
    for (const struct of structs) {
      const issues = [...struct.check(input, context)];

      if (!issues.length) return;
    }

    yield { message: formatActExp(name, input) };
  });
}

/** Create intersection struct. */
export function and<S extends readonly Struct<unknown>[]>(
  ...structs: S
): Struct<UnionToIntersection<S[number]>> {
  const name = structs.map(prop(Symbol.toStringTag)).join(" & ");

  return new Construct(`(${name})`, function* (input, context) {
    for (const struct of structs) {
      const iter = struct.check(input, context)[Symbol.iterator]();
      const { done, value } = iter.next();

      if (!done) {
        yield value;
        break;
      }
    }
  });
}
