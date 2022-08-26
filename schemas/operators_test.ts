import { OrSchema } from "./operators.ts";
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
