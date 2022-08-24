import { MaxSchema, MinSchema } from "./unions.ts";
import { describe, expect, it } from "../dev_deps.ts";

describe("MaxSchema", () => {
  it("should throw error when the value is greater than", () => {
    expect(() => new MaxSchema(3).assert?.(4)).toThrow(
      `Invalid range. 3 < 4`,
    );
  });

  it("should not throw error when the value is valid", () => {
    expect(() => new MaxSchema(4).assert?.(4)).not.toThrow();
    expect(() => new MaxSchema(5).assert?.(4)).not.toThrow();
  });
});

describe("MinSchema", () => {
  it("should throw error when the value is less than", () => {
    expect(() => new MinSchema(4).assert?.(3)).toThrow(`Invalid range. 4 > 3`);
  });

  it("should not throw error when the value is valid", () => {
    expect(() => new MinSchema(3).assert?.(3)).not.toThrow();
    expect(() => new MinSchema(2).assert?.(3)).not.toThrow();
  });
});
