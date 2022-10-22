export const type = Symbol("type");
export type type = typeof type;

/** Dynamic extendable object API. */
export interface Extendable {
  extend<V>(value: V): this & V;
}

/** Checkable API. */
export interface Checkable<Out extends In, In = unknown> {
  /** Checks input and returns an iterated issue if there is a problem. */
  readonly check: (input: In, context: InputContext) => Iterable<Issue>;

  /** Guaranteed input types. */
  readonly [type]: Out;
}

export interface Definable<D> {
  readonly definition: D;
}

export interface Issue extends InputContext {
  /** Issue message. */
  readonly message: string;
}

/** Context for input data. */
export interface InputContext {
  /** Path to the value. */
  readonly paths: readonly string[];
}

export interface Showable {
  readonly [Symbol.toStringTag]: string;
}

/** Dada struct API. */
export interface Struct<Out extends In, In = unknown>
  extends Showable, Checkable<Out, In> {}

export type Infer<T> = T extends Checkable<infer U, infer U> ? Infer<U>
  : { [k in keyof T]: Infer<T[k]> };

/** Struct check options. */
export interface CheckOptions {
  /** Stop after first failure. */
  readonly failFast?: boolean;
}

export interface ObjectSchema {
  readonly [k: string]: Struct<unknown>;
}
