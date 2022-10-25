import { IsTopType, PartialBy } from "./deps.ts";

export const type = Symbol("type");
export type type = typeof type;

/** Checkable API. */
export interface Checkable<In, Out extends In> {
  /** Checks input and returns an iterated issue if there is a problem. */
  readonly check: (input: In) => Iterable<PartialBy<Issue, "paths">>;

  /** Guaranteed input types. */
  readonly [type]: Out;
}

export interface Definable<S> {
  readonly definition: S;
}

export interface Issue {
  /** Issue message. */
  readonly message: string;

  /** Path to the value. */
  readonly paths: readonly string[];
}

export interface Showable {
  readonly [Symbol.toStringTag]: string;
}

/** Dada struct API. */
export interface Struct<In, Out extends In = any>
  extends Showable, Checkable<In, Out> {}

export type Infer<T> = IsTopType<T> extends true ? T
  : T extends Checkable<infer U, infer U> ? Infer<U>
  : { [k in keyof T]: Infer<T[k]> };

/** Struct check options. */
export interface CheckOptions {
  /** Stop after first failure. */
  readonly failFast?: boolean;
}

export interface StructMap {
  readonly [k: string]: Struct<unknown>;
}
