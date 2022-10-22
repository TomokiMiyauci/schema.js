import { Struct } from "./types.ts";
import { Construct, formatActExp } from "./utils.ts";

/** Create union structs. */
export function or<S extends readonly Struct<unknown>[]>(
  ...structs: S
): Struct<S[number]> {
  const name = structs.map((struct) => struct[Symbol.toStringTag]).join(
    " | ",
  );

  return new Construct(`(${name})`, function* (input, context) {
    for (const struct of structs) {
      const issues = [...struct.check(input, context)];

      if (!issues.length) return;
    }

    yield { message: formatActExp(name, input) };
  });
}
