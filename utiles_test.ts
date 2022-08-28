import { defineSchemaProperty } from "./utils.ts";
import { describe, expect, it } from "./dev_deps.ts";
import { StringSchema } from "./schemas/scalers.ts";
import { MaxCountSchema } from "./schemas/unions.ts";

describe("defineSchemaProperty", () => {
  it("should throw error when any schema is invalid", () => {
    const string = defineSchemaProperty(StringSchema, "max", MaxCountSchema);

    expect(() => new string().max(100).max(99).max(20).max(5).assert(3))
      .toThrow();

    expect(() => new string().max(100).max(99).max(20).max(5).assert("abcdef"))
      .toThrow();
  });

  it("should pass when all schema is valid", () => {
    const string = defineSchemaProperty(StringSchema, "max", MaxCountSchema);

    expect(new string().max(100).max(99).max(20).max(5).assert("55555"));
  });
});
