import { isNonNullable, isString, PartialBy } from "./deps.ts";
import {
  Extendable,
  Failure,
  ProofContext,
  Provable,
  Schema,
  type,
} from "./types.ts";

export function show(value: unknown): string {
  return isString(value) ? `"${value}"` : String(value);
}

export function constructorName(value: unknown): string {
  if (isNonNullable(value)) return value.constructor.name;

  return String(value);
}

export class Prover<Type extends ParentType, ParentType = unknown>
  implements Schema, Provable<Type, ParentType>, Extendable {
  proof: (
    value: ParentType,
    context: ProofContext,
  ) => Iterable<Failure>;

  constructor(
    public name: string,
    proof: (
      value: ParentType,
      context: ProofContext,
    ) => Iterable<PartialBy<Failure, "paths">>,
  ) {
    this.proof = function* (value, context) {
      for (const fail of proof(value, context)) {
        yield { ...context, ...fail };
      }
    };
  }

  use = <T>(value: T): this & T => Object.assign(this, value);

  declare [type]: Type;
}

export interface FailureContexts {
  readonly causedBy?: keyof ProxyHandler<{}>;
  readonly paths?: string[];
}

export function fail(
  message: string,
  contexts?: FailureContexts,
): PartialBy<Failure, "paths"> {
  return {
    ...contexts,
    message,
  };
}
