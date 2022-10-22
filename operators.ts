import {
  Checkable,
  InputContext,
  Intersection,
  Issue,
  Struct,
  type,
} from "./types.ts";
import { Construct, formatActExp } from "./utils.ts";
import { iter, prop } from "./deps.ts";

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
export function and<Out extends In, In>(
  struct: Struct<Out, In>,
): Struct<Out, In> & Intersection<Out, Out> {
  class IntersectionStruct
    implements Checkable<Out, In>, Intersection<Out, Out> {
    constructor(private structs: Struct<any, any>[]) {}

    and<T extends Out>(struct: Struct<T, Out>): this {
      return new IntersectionStruct([...this.structs, struct]) as this;
    }

    *check(input: In, context: InputContext): Iterable<Issue> {
      for (const struct of this.structs) {
        const iterator = iter(struct.check(input, context));
        const { done, value } = iterator.next();

        if (!done) {
          yield value;
          break;
        }
      }
    }

    get [Symbol.toStringTag](): string {
      const name = this.structs.map(prop(Symbol.toStringTag)).join(" & ");
      return `(${name})`;
    }

    declare [type]: Out;
  }

  return new IntersectionStruct([struct]);
}
