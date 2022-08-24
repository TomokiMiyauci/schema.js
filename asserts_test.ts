import { assertEmailFormat, assertNoNNegativeInteger } from "./asserts.ts";
import { describe, expect, it } from "./dev_deps.ts";

describe("assertEmailFormat", () => {
  it("should throw error when the format is invalid", () => {
    expect(() => assertEmailFormat("")).toThrow(`Invalid email format.`);
  });

  it("should not throw error when the format is valid", () => {
    expect(() => assertEmailFormat("test@test.test")).not.toThrow();
  });
});

describe("assertNoNNegativeInteger", () => {
  it("should throw error when the value is not non negative integer", () => {
    expect(() => assertNoNNegativeInteger(-1)).toThrow(
      `The argument must be non negative integer.`,
    );
    expect(() => assertNoNNegativeInteger(NaN)).toThrow();
    expect(() => assertNoNNegativeInteger(0.1)).toThrow();
  });

  it("should be return undefined when success", () => {
    expect(assertNoNNegativeInteger(0)).toBeUndefined();
    expect(assertNoNNegativeInteger(-0)).toBeUndefined();
    expect(assertNoNNegativeInteger(+0)).toBeUndefined();
    expect(assertNoNNegativeInteger(1)).toBeUndefined();
    expect(assertNoNNegativeInteger(1.0)).toBeUndefined();
    expect(assertNoNNegativeInteger(100)).toBeUndefined();
  });
});
