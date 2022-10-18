import { Failure, Provable } from "./types.ts";

export const $ = {
  $<Type extends ParentType, ParentType, T>(
    this: T & Provable<Type, ParentType>,
    subProver: Provable<Type, Type>,
  ): T {
    const _proof = this.proof;

    function* proof(value: ParentType): Iterable<Failure> {
      const result = [..._proof(value)];

      if (result.length) {
        return yield* result;
      }

      yield* subProver.proof(value as Type);
    }

    return Object.assign(this, { proof });
  },
};
