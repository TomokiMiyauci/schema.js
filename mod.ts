export { StructError } from "./error.ts";
export {
  type CheckOptions,
  type Infer,
  type Showable,
  type Struct,
} from "./types.ts";
export {
  array,
  bigint,
  boolean,
  func,
  instance,
  number,
  object,
  omit,
  partial,
  pick,
  record,
  string,
  symbol,
  value,
} from "./structs/cores.ts";
export {
  empty,
  list,
  maximum,
  maxSize,
  minimum,
  minSize,
  nonempty,
  pattern,
  tuple,
} from "./structs/subsets.ts";
export { assert, is, validate, type ValidateResult } from "./checks.ts";
export { and, type Intersection, or, type Union } from "./structs/operators.ts";
