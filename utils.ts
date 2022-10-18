import { isNonNullable, isString } from "./deps.ts";
import {
  Extendable,
  Failure,
  FailureOptions,
  Provable,
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
  implements Provable<Type, ParentType>, Extendable {
  constructor(public proof: (value: ParentType) => Iterable<Failure>) {}

  use = <T>(value: T): this & T => Object.assign(this, value);

  declare [type]: Type;
}

export function fail(message: string, options?: FailureOptions): Failure {
  return {
    ...options,
    message,
  };
}
