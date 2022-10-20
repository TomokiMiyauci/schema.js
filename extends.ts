import { Checkable, CheckContext, Issue, Struct } from "./types.ts";

export const $ = {
  $<Out extends In, In, T>(
    this: T & Struct & Checkable<Out, In>,
    subProver: Struct & Checkable<Out, Out>,
  ): T {
    const _check = this.check;
    const name = this.name + " & " + subProver.name;

    function* check(input: In, context: CheckContext): Iterable<Issue> {
      const result = [..._check(input, context)];

      if (result.length) {
        return yield* result;
      }

      yield* subProver.check(input as Out, context);
    }

    return Object.assign(this, { check, name });
  },
};
