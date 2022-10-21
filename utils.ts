import { isNonNullable } from "./deps.ts";
import {
  Checkable,
  Extendable,
  InputContext,
  Issue,
  ReferenceIssue,
  Struct,
  StructIssue,
  type,
  TypeIssue,
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
  public check: (input: In, context: InputContext) => Iterable<StructIssue>;

  constructor(
    public name: string,
    check: (
      input: In,
      context: InputContext,
    ) => Iterable<Partial<InputContext> & (Issue | ReferenceIssue | TypeIssue)>,
  ) {
    this.check = function* (value, context) {
      for (const issue of check(value, context)) {
        yield { ...context, ...issue };
      }
    };
  }

  extend = <T>(value: T): this & T => Object.assign(this, value);

  declare [type]: Out;
}
