import { Failure, ProofContext, Provable, Schema } from "./types.ts";

export const $ = {
  $<Type extends ParentType, ParentType, T>(
    this: T & Schema & Provable<Type, ParentType>,
    subProver: Schema & Provable<Type, Type>,
  ): T {
    const _proof = this.proof;
    const name = this.name + " & " + subProver.name;

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

    return Object.assign(this, { proof, name });
  },
};
