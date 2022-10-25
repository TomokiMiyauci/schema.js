import { isNonNullable, PartialBy } from "./deps.ts";
import { Issue, Struct, type } from "./types.ts";

/** Get constructor name.
 * When the value can not construct, return `"null"` or `"undefined"`.
 */
export function constructorName(value: unknown): string {
  if (isNonNullable(value)) return value.constructor.name;

  return String(value);
}

export class Construct<In, Out extends In> implements Struct<In, Out> {
  #name: string;

  constructor(
    name: string,
    public check: (input: In) => Iterable<PartialBy<Issue, "paths">>,
  ) {
    this.#name = name;
  }

  public get [Symbol.toStringTag](): string {
    return this.#name;
  }

  declare [type]: Out;
}

export function formatActExp(expected: unknown, actual: unknown): string {
  return `expected ${expected}, actual ${actual}`;
}

/** Plural-aware formatter. */
export function formatPlural(value: string, number: number): string {
  if (1 < number) {
    value = `${value}s`;
  }

  return `${number} ${value}`;
}

type DataType =
  | "null"
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "function"
  | "object"
  | "undefined"
  | "symbol";

export function formatType(value: unknown): DataType {
  return value === null ? "null" : typeof value;
}

export function* mergeIssuePaths(
  issues: Iterable<PartialBy<Issue, "paths">>,
  paths: Iterable<string>,
): Iterable<Issue> {
  for (const issue of issues) {
    yield { message: issue.message, paths: [...paths, ...issue.paths ?? []] };
  }
}
