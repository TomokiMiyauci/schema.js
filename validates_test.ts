import { isSchema } from "./validates.ts";
import { describe, expect, it } from "./dev_deps.ts";
import { StringSchema } from "./mod.ts";

describe("isSchema", () => {
  it("should return false", () => {
    expect(isSchema(null)).toBeFalsy();
    expect(isSchema({})).toBeFalsy();
  });

  it("should pass when the value has functional assert property", () => {
    expect(isSchema(new StringSchema())).toBeTruthy();
    expect(isSchema({ assert: Function })).toBeTruthy();
  });
});
