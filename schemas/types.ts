import { Schema, SuccessResult, UnwrapResult } from "../types.ts";

export type SuccessType<S extends Schema> = UnwrapResult<
  ReturnType<S["validate"]>
>;

export type Unwrap<T extends object> = {
  [k in keyof T]: T[k] extends Schema ? SuccessType<T[k]> : T[k];
};

export type UnwrapSchema<
  S extends Schema,
  R extends ReturnType<S["validate"]> = ReturnType<S["validate"]>,
> = R extends SuccessResult ? R["data"]
  : never;
