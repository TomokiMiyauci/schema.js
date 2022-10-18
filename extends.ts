import { Failure, ProofContext, Provable } from "./types.ts";

export const $ = {
  $<Type extends ParentType, ParentType, T>(
    this: T & Provable<Type, ParentType>,
    subProver: Provable<Type, Type>,
  ): T {
    const _proof = this.proof;

    function* proof(
      value: ParentType,
      context: ProofContext,
    ): Iterable<Failure> {
      const result = [..._proof(value, context)];

      if (result.length) {
        return yield* result;
      }

      yield* subProver.proof(value as Type, context);
    }

    return Object.assign(this, { proof });
  },
};
