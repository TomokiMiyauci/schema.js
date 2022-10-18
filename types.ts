export const type = Symbol("type");
export type type = typeof type;

export interface Extendable {
  use<V>(value: V): this & V;
}

export interface Provable<Type extends ParentType, ParentType = unknown> {
  readonly proof: (value: ParentType) => Iterable<Failure>;

  readonly [type]: Type;
}

export interface Schema<Type extends ParentType, ParentType = unknown>
  extends Extendable, Provable<Type, ParentType> {}

export type Infer<T> = T extends Provable<infer U, infer U> ? Infer<U>
  : { [k in keyof T]: Infer<T[k]> };

export type InferSchema<T extends Provable<unknown>> = Infer<T[typeof type]>;

export type Arg<F extends (...args: any) => any, N extends number> = Parameters<
  F
>[N];

export type Is<T extends Function> = T extends (value: any) => value is infer X
  ? X
  : never;

export interface Failure extends FailureOptions {
  readonly message: string;
}

export interface FailureOptions {
  readonly causedBy?: keyof ProxyHandler<{}>;
}
