export const type = Symbol("type");
export type type = typeof type;

/** Dynamic extendable object API. */
export interface Extendable {
  extend<V>(value: V): this & V;
}

/** Checkable API. */
export interface Checkable<Out extends In, In = unknown> {
  /** Checks input and returns an iterated issue if there is a problem. */
  readonly check: (
    input: In,
    context: CheckContext,
  ) => Iterable<Issue>;

  /** Guaranteed input types. */
  readonly [type]: Out;
}

export type Issue =
  & {
    /** Issue message. */
    readonly message: string;
  }
  & CheckContext;

/** Context for checking input. */
export interface CheckContext {
  /** Path to the value. */
  readonly paths: string[];
}

/** Dada struct API. */
export interface Struct {
  readonly name: string;
}

export interface CheckableStruct<Out extends In, In = unknown>
  extends Struct, Extendable, Checkable<Out, In> {}

export type Infer<T> = T extends Checkable<infer U, infer U> ? Infer<U>
  : { [k in keyof T]: Infer<T[k]> };

export type InferType<T extends Checkable<unknown>> = Infer<T[type]>;

/** Struct check options. */
export interface CheckOptions {
  /** Stop after first failure. */
  readonly failFast?: boolean;
}
