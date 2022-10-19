export const type = Symbol("type");
export type type = typeof type;

export interface Extendable {
  use<V>(value: V): this & V;
}

export interface ProofContext {
  readonly paths: string[];
}

export interface Provable<Type extends ParentType, ParentType = unknown> {
  readonly proof: (
    value: ParentType,
    context: ProofContext,
  ) => Iterable<Failure>;

  readonly [type]: Type;
}

export interface Schema {
  readonly name: string;
}

export interface ProvableSchema<Type extends ParentType, ParentType = unknown>
  extends Schema, Extendable, Provable<Type, ParentType> {}

export type Infer<T> = T extends Provable<infer U, infer U> ? Infer<U>
  : { [k in keyof T]: Infer<T[k]> };

export type InferSchema<T extends Provable<unknown>> = Infer<T[typeof type]>;

export type Arg<F extends (...args: any) => any, N extends number> = Parameters<
  F
>[N];

export type Is<T extends Function> = T extends (value: any) => value is infer X
  ? X
  : never;

export interface Failure {
  readonly message: string;

  readonly causedBy?: keyof ProxyHandler<{}>;

  readonly paths: string[];
}
