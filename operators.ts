import { Checkable, Intersection, Issue, Struct, type } from "./types.ts";
import { formatActExp } from "./utils.ts";
import { iter, PartialBy, prop } from "./deps.ts";

export function or<In, Out extends In>(
  struct: Struct<In, Out>,
) {
  class UnionStruct<_ extends Out = Out> implements Struct<In, _> {
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

    or = <T extends Out>(struct: Struct<In, T>): UnionStruct<T | _> => {
      return new UnionStruct([...this.structs, struct]);
    };
  }

  return new UnionStruct([struct]);
}

/** Create intersection struct. */
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

    get [Symbol.toStringTag](): string {
      const name = this.structs.map(prop(Symbol.toStringTag)).join(" & ");
      return name;
    }

    declare [type]: Out;
  }

  return new IntersectionStruct<In, Out>([struct]);
}
