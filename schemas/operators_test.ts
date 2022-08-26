import { AndSchema, OrSchema } from "./operators.ts";
import { describe, expect, it } from "../dev_deps.ts";
import { NullSchema, StringSchema, UndefinedSchema } from "./scalers.ts";

describe("OrSchema", () => {
  it("should throw error when the subtype is not equal", () => {
    expect(() => new OrSchema(1, 2, 3, "").assert("a")).toThrow();
    expect(() => new OrSchema({}).assert({})).toThrow();
  });

  it("should throw error when the schema is not satisfy", () => {
    expect(() =>
      new OrSchema(1, new StringSchema(), new NullSchema()).assert(undefined)
    ).toThrow();
  });

  it("should pass when one of more schema satisfy", () => {
    expect(new OrSchema().assert("")).toBeUndefined();

    expect(
      new OrSchema(new StringSchema(), new NullSchema(), new UndefinedSchema())
        .assert(undefined),
    ).toBeUndefined();

    expect(new OrSchema(1, 2, 3).assert(3)).toBeUndefined();
  });
});

describe("AndSchema", () => {
  it("should throw error when one or more schema is not satisfy", () => {
    expect(() =>
      new AndSchema(new StringSchema(), new StringSchema("test")).assert("")
    ).toThrow();

    expect(
      () =>
        new AndSchema(0, 1, 2).assert(
          0,
        ),
    ).toThrow();
  });

  it("should pass when all schema is satisfy", () => {
    expect(
      new AndSchema(new StringSchema(), new StringSchema("test")).assert(
        "test",
      ),
    ).toBeUndefined();

    expect(
      new AndSchema(0).assert(
        0,
      ),
    ).toBeUndefined();
  });
});
