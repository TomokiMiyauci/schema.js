import { DateSchema } from "./built_in.ts";
import { describe, expect, it } from "../dev_deps.ts";

describe("DateSchema", () => {
  it("should throw error when the value is not Date object", () => {
    expect(() => new DateSchema().assert({})).toThrow();
  });

  it("should not throw error when the value is valid", () => {
    expect(new DateSchema().assert(new Date())).toBeUndefined();
  });
});
