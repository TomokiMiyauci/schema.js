// Copyright 2022-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { IsTopType, PartialBy } from "./deps.ts";

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

export interface Issue {
  /** Issue message. */
  readonly message: string;

  /** Path to the value. */
  readonly paths: readonly string[];
}

export interface Showable {
  readonly toString: () => string;
}

/** Dada struct API. */
export interface Struct<In, Out extends In = any>
  extends Showable, Checkable<In, Out> {}

export type Infer<T> = IsTopType<T> extends true ? T
  : T extends Checkable<infer U, infer U> ? Infer<U>
  : { [k in keyof T]: Infer<T[k]> };

export interface StructMap {
  readonly [k: string]: Struct<unknown>;
}
