import { assertEmailFormat } from "./asserts.ts";
import { describe, expect, it } from "./dev_deps.ts";

describe("isEmailFormat", () => {
  it("should throw error when the format is invalid", () => {
    expect(() => assertEmailFormat("")).toThrow(`Invalid email format.`);
  });

  it("should not throw error when the format is valid", () => {
    expect(() => assertEmailFormat("test@test.test")).not.toThrow();
  });
});
