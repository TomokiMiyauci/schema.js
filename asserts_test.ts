import { assertEquals, assertOr } from "./asserts.ts";
import {
  assertBoolean,
  assertNull,
  assertString,
  assertUndefined,
  describe,
  expect,
  it,
} from "./dev_deps.ts";

describe("assertOr", () => {
  it("should throw error when all assertions is fail", () => {
    expect(() =>
      assertOr([assertBoolean, assertUndefined, assertNull] as const, "")
    )
      .toThrow();
  });

  it("should pass when pass one of more assertion", () => {
    expect(
      assertOr(
        [assertBoolean, assertUndefined, assertNull, assertString] as const,
        "",
      ),
    )
      .toBeUndefined();
  });
});

describe("assertEquals", () => {
  it("should throw error when the value is not equal", () => {
    expect(() => assertEquals("", "a")).toThrow();
  });

  it("should throw error because default equality uses Object.is", () => {
    expect(() => assertEquals({}, {})).toThrow();
  });

  it("should pass when the value is equal", () => {
    expect(assertEquals("", "")).toBeUndefined();
    const obj = {};
    expect(assertEquals(obj, obj)).toBeUndefined();
  });

  it("should custom compare logic", () => {
    expect(
      assertEquals(
        {},
        {},
        (a, b) => Object(a)["constructor"] === Object(b)["constructor"],
      ),
    )
      .toBeUndefined();
  });
});
