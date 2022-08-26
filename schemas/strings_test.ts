import { StringEmailSchema } from "./strings.ts";
import { describe, expect, it } from "../dev_deps.ts";

describe("StringEmailSchema", () => {
  it("should throw error when the value is not email format", () => {
    expect(() => new StringEmailSchema().assert?.("")).toThrow();
  });

  it("should not throw error when the value is email format", () => {
    expect(() => new StringEmailSchema().assert?.("test@test.test")).not
      .toThrow();
  });
});
