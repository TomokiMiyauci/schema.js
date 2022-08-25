import {
  assertEmailFormat,
  assertHasProperty,
  assertNoNNegativeInteger,
} from "./asserts.ts";
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

describe("assertHasProperty", () => {
  it("should throw error when the object has not property of string", () => {
    expect(() => assertHasProperty("", {})).toThrow();
  });

  it("should throw error when the object has not property of number", () => {
    expect(() => assertHasProperty(0, {})).toThrow();
  });

  it("should throw error when the object has not property of symbol", () => {
    expect(() => assertHasProperty(Symbol("test"), {})).toThrow();
  });

  it("should return undefined when the object has property", () => {
    expect(assertHasProperty("", { "": "0" })).toBeUndefined();
    expect(assertHasProperty(0, { 0: "0" })).toBeUndefined();
    expect(assertHasProperty(0, { "0": "0" })).toBeUndefined();
    expect(assertHasProperty(Symbol.for("t"), { [Symbol.for("t")]: "0" }))
      .toBeUndefined();
  });
});
