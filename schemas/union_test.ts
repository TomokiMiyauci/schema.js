import {
  CountSchema,
  MaxCountSchema,
  MaxSchema,
  MinCountSchema,
  MinSchema,
} from "./unions.ts";
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

describe("CountSchema", () => {
  it("should throw error when the number of elements is not match", () => {
    expect(() => new CountSchema(10).assert?.("")).toThrow(
      `Must be 10 element number.`,
    );
    expect(() => new CountSchema(10).assert?.("abc")).toThrow();
  });

  it("should throw error when the argument is not non negative integer", () => {
    expect(() => new CountSchema(-1)).toThrow(
      `The argument must be non negative integer.`,
    );
  });

  it("should be success", () => {
    expect(new CountSchema(0).assert("")).toBeUndefined();
    expect(new CountSchema(10).assert("a".repeat(10))).toBeUndefined();
    expect(new CountSchema(3).assert("A\uD87E\uDC04Z")).toBeUndefined();
    expect(new CountSchema(0).assert([])).toBeUndefined();
    expect(new CountSchema(4).assert([null, null, null, null])).toBeUndefined();
  });
});

describe("MinCountSchema", () => {
  it("should throw error when the number of elements is greater then argument", () => {
    expect(() => new MinCountSchema(10).assert?.("")).toThrow(
      `The element numbers must be greater than 10.`,
    );
    expect(() => new MinCountSchema(-1).assert?.("")).toThrow();

    expect(() => new MinCountSchema(3).assert([])).toThrow();
  });

  it("should be success", () => {
    expect(new MinCountSchema(0).assert("")).toBeUndefined();
    expect(new MinCountSchema(3).assert(".".repeat(3))).toBeUndefined();
    expect(new MinCountSchema(3).assert(".".repeat(10))).toBeUndefined();
    expect(new MinCountSchema(3).assert(new Array(4))).toBeUndefined();
  });
});

describe("MaxCountSchema", () => {
  it("should throw error when the number of elements is less then argument", () => {
    expect(() => new MaxCountSchema(0).assert?.("a")).toThrow(
      `The element numbers must be less than 0.`,
    );
    expect(() => new MaxCountSchema(-1).assert?.("")).toThrow();

    expect(() => new MaxCountSchema(3).assert(new Array(4))).toThrow();
  });

  it("should be success", () => {
    expect(new MaxCountSchema(0).assert("")).toBeUndefined();
    expect(new MaxCountSchema(0).assert([])).toBeUndefined();
    expect(new MaxCountSchema(3).assert(".".repeat(3))).toBeUndefined();
    expect(new MaxCountSchema(10).assert(".".repeat(3))).toBeUndefined();
    expect(new MaxCountSchema(3).assert(new Array(2))).toBeUndefined();
  });
});
