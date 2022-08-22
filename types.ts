import { SchemaError } from "./errors.ts";
import { valueOf } from "./deps.ts";

export interface ScalerTypeMap {
  string: string;
  number: number;
  bigint: bigint;
  null: null;
  undefined: undefined;
  boolean: boolean;
  symbol: symbol;
}

export type Primitive = valueOf<ScalerTypeMap>;

export interface ObjectTypeMap {
  object: object;
  function: Function;
}

export interface SuperTypeMap extends ScalerTypeMap, ObjectTypeMap {}

export type SuperType = valueOf<SuperTypeMap>;

export type TypeStr = keyof SuperTypeMap;

export interface Schema<T = unknown, V = unknown> {
  validate(value: V): Result<T>;
}

export type Result<T = unknown> =
  | SuccessResult<T>
  | FailResult;

export type SuccessResult<T = unknown> = {
  data: T;
};

export type FailResult = {
  errors: SchemaError[];
};

export type UnwrapResult<R extends Result> = R extends SuccessResult ? R["data"]
  : never;
