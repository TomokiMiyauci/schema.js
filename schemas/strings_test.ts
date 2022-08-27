import { EmailFormatSchema } from "./strings.ts";
import { describe, expect, it } from "../dev_deps.ts";

describe("EmailFormatSchema", () => {
  it("should throw error when the value is not email format", () => {
    expect(() => new EmailFormatSchema().assert?.("")).toThrow();
  });

  it("should not throw error when the value is email format", () => {
    expect(() => new EmailFormatSchema().assert?.("test@test.test")).not
      .toThrow();
  });
});
