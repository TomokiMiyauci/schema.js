import { assertLength, assertMaxLength, assertMinLength } from "../asserts.ts";
import { CollectiveTypeSchema } from "./utils.ts";
import { arity } from "../deps.ts";

export class LengthSchema<T extends string>
  extends CollectiveTypeSchema<string, T> {
  override assert;

  constructor(length: number) {
    super();
    this.assert = arity(assertLength, length);
  }
}

export class MaxLengthSchema<T extends string>
  extends CollectiveTypeSchema<string, T> {
  override assert;

  constructor(length: number) {
    super();
    this.assert = arity(assertMaxLength, length);
  }
}

export class MinLengthSchema<T extends string>
  extends CollectiveTypeSchema<string, T> {
  override assert;

  constructor(length: number) {
    super();
    this.assert = arity(assertMinLength, length);
  }
}
