import { isNonNullable } from "./deps.ts";
import {
  Checkable,
  CheckContext,
  Extendable,
  Issue,
  Struct,
  type,
} from "./types.ts";

/** Get constructor name.
 * When the value can not construct, return `"null"` or `"undefined"`.
 */
export function constructorName(value: unknown): string {
  if (isNonNullable(value)) return value.constructor.name;

  return String(value);
}

export class Check<Out extends In, In = unknown>
  implements Struct, Checkable<Out, In>, Extendable {
  public check: (input: In, context: CheckContext) => Iterable<Issue>;

  constructor(
    public name: string,
    check: (
      input: In,
      context: CheckContext,
    ) => Iterable<Partial<Issue> & Pick<Issue, "message">>,
  ) {
    this.check = function* (value, context) {
      for (const fail of check(value, context)) {
        yield { ...context, ...fail };
      }
    };
  }

  extend = <T>(value: T): this & T => Object.assign(this, value);

  declare [type]: Out;
}
