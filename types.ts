// Copyright 2022-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { FirstArg, IsTopType, PartialBy } from "./deps.ts";

const Type = Symbol("Struct.type");

export const Struct: {
  /** Symbol for struct type. */
  readonly type: typeof Type;
} = { type: Type };

/** Checkable API. */
export interface Checkable<In, Out extends In> {
  /** Checks input and returns an iterated issue if there is a problem. */
  readonly check: (input: In) => Iterable<PartialBy<Issue, "paths">>;

  /** Guaranteed input types. */
  readonly [Struct.type]: Out;
}

export interface Definable<S> {
  readonly definition: S;
}

/** Issue API. */
export interface Issue {
  /** Issue message. */
  readonly message: string;

  /** Path to the value. */
  readonly paths: readonly string[];
}

/** String Convertible API. */
export interface Showable {
  /** overwrite`Object.prototype.string`. */
  readonly toString: () => string;
}

/** Dada struct API. */
export interface Struct<In, Out extends In = any>
  extends Showable, Checkable<In, Out> {}

export type Infer<T> = IsTopType<T> extends true ? T
  : T extends Checkable<infer U, infer U> ? Infer<U>
  : { [k in keyof T]: Infer<T[k]> };

/** Infer `Struct` input. */
export type InferIn<S extends Struct<any>> = Infer<FirstArg<S["check"]>>;

/** Infer `Struct` output. */
export type InferOut<S extends Struct<any>> = Infer<S[typeof Type]>;

export interface StructMap {
  readonly [k: string]: Struct<unknown>;
}

/** Wrapper container API. */
export interface Wrapper<T> {
  /** Unwrap wrapper. */
  unwrap: (this: Wrapper<T>) => T;
}

/** Dynamic messenger API. */
export interface Messenger<Context> {
  /** Lazy message. */
  (context: Context): string;
}

/** JavaScript data type. `null` is not `object`. */
export type DataType =
  | "null"
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "function"
  | "object"
  | "undefined"
  | "symbol";

/** Context of result. */
export interface ResultContext<T> {
  /** Actual value or expression. */
  readonly actual: T;

  /** Expected value or expression. */
  readonly expected: T;
}
