import { assertLength, assertMaxLength, assertMinLength } from "../asserts.ts";
import { CollectiveTypeSchema } from "./utils.ts";
import { arity } from "../deps.ts";

export class LengthSchema<T extends string>
  extends CollectiveTypeSchema<string, T> {
  protected override assertion: (value: string) => asserts value is T;

  constructor(length: number) {
    super();
    this.assertion = arity(assertLength, length);
  }
}

export class MaxLengthSchema<T extends string>
  extends CollectiveTypeSchema<string, T> {
  protected override assertion: (value: string) => asserts value is T;

  constructor(length: number) {
    super();
    this.assertion = arity(assertMaxLength, length);
  }
}

export class MinLengthSchema<T extends string>
  extends CollectiveTypeSchema<string, T> {
  protected override assertion: (value: string) => asserts value is T;

  constructor(length: number) {
    super();
    this.assertion = arity(assertMinLength, length);
  }
}
