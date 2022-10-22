export { SchemaError } from "./error.ts";
export { type CheckOptions, type Infer, type Showable } from "./types.ts";
export {
  bigint,
  boolean,
  func,
  number,
  object,
  partial,
  pick,
  record,
  string,
  tuple,
} from "./cores.ts";
export { assert, is, validate } from "./checks.ts";
export { $ } from "./extends.ts";
export { or } from "./operators.ts";
