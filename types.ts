declare const type: unique symbol;

export class Prover<Type extends ParentType, ParentType = unknown>
  implements Provable<Type, ParentType> {
  constructor(public proof: (value: ParentType) => Iterable<Error>) {}

  $ = (subProver: Prover<Type, Type>): Prover<Type, ParentType> => {
    const _proof = this.proof;
    function* proof(value: ParentType): Iterable<Error> {
      const result = [..._proof(value)];

      if (result.length) {
        return yield* result;
      }

      yield* subProver.proof(value as Type);
    }

    return new Prover<Type, ParentType>(proof);
  };

  declare [type]: Type;
}

export interface Provable<Type extends ParentType, ParentType = unknown> {
  readonly proof: (value: ParentType) => Iterable<Error>;

  readonly [type]: Type;
}

export type Infer<T> = T extends Prover<infer U, infer U> ? Infer<U>
  : { [k in keyof T]: Infer<T[k]> };

export type InferSchema<T extends Provable<unknown>> = Infer<T[typeof type]>;

export type Arg<F extends (...args: any) => any, N extends number> = Parameters<
  F
>[N];

export type Is<T extends Function> = T extends (value: any) => value is infer X
  ? X
  : never;
