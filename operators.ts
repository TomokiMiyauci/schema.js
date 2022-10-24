import { Checkable, Intersection, Issue, Struct, type } from "./types.ts";
import { formatActExp } from "./utils.ts";
import { iter, PartialBy, prop } from "./deps.ts";

export function or<In, Out>(
  struct: Struct<In, Out>,
) {
  class UnionStruct<_ = Out> implements Struct<In, _> {
    constructor(public structs: Struct<any, any>[]) {}

    *check(input: In): Iterable<PartialBy<Issue, "paths">> {
      for (const struct of this.structs) {
        const issues = [...struct.check(input)];

        if (!issues.length) return;
      }

      yield {
        message: formatActExp(this[Symbol.toStringTag], input),
      };
    }

    get [Symbol.toStringTag](): string {
      const name = this.structs.map(prop(Symbol.toStringTag)).join(" | ");
      return `(${name})`;
    }

    declare [type]: _;

    or = <T extends In>(struct: Struct<In, T>): UnionStruct<T | _> => {
      return new UnionStruct([...this.structs, struct]);
    };
  }

  return new UnionStruct([struct]);
}

/** Create intersection struct. */
export function and<In, Out>(
  struct: Struct<In, Out>,
): Struct<In, Out> & Intersection<Out, Out> {
  class IntersectionStruct
    implements Checkable<In, Out>, Intersection<Out, Out> {
    constructor(private structs: Struct<any, any>[]) {}

    and<T extends Out>(struct: Struct<T, T>): this {
      return new IntersectionStruct([...this.structs, struct]) as this;
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

    get [Symbol.toStringTag](): string {
      const name = this.structs.map(prop(Symbol.toStringTag)).join(" & ");
      return name;
    }

    declare [type]: Out;
  }

  return new IntersectionStruct([struct]);
}
