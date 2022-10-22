import { isNonNullable, PartialBy } from "./deps.ts";
import { InputContext, Issue, Struct, type } from "./types.ts";

/** Get constructor name.
 * When the value can not construct, return `"null"` or `"undefined"`.
 */
export function constructorName(value: unknown): string {
  if (isNonNullable(value)) return value.constructor.name;

  return String(value);
}

export class Construct<Out extends In, In = unknown>
  implements Struct<Out, In> {
  public check: (input: In, context: InputContext) => Iterable<Issue>;

  #name: string;

  constructor(
    name: string,
    check: (
      input: In,
      context: InputContext,
    ) => Iterable<PartialBy<Issue, "paths">>,
  ) {
    this.#name = name;
    this.check = function* (value, context) {
      for (const issue of check(value, context)) {
        yield { ...context, ...issue };
      }
    };
  }

  public get [Symbol.toStringTag](): string {
    return this.#name;
  }

  declare [type]: Out;
}

export function formatActExp(expected: unknown, actual: unknown): string {
  return `expected ${expected}, actual ${actual}`;
}
