// Copyright 2022-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

export { StructError } from "./error.ts";
export { type Checkable, type Infer, type Showable, Struct } from "./types.ts";
export {
  array,
  bigint,
  boolean,
  func,
  instance,
  number,
  object,
  string,
  symbol,
  value,
} from "./structs/cores.ts";
export { omit, partial, pick, record } from "./structs/utils.ts";
export {
  empty,
  int,
  list,
  maximum,
  maxSize,
  minimum,
  minSize,
  nan,
  negative,
  nonempty,
  pattern,
  positive,
  size,
  tuple,
  validDate,
} from "./structs/subsets.ts";
export {
  assert,
  type CheckOptions,
  is,
  validate,
  type ValidateResult,
} from "./checks.ts";
export {
  and,
  type Intersection,
  not,
  or,
  type Union,
} from "./structs/operators.ts";
