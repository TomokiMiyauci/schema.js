import { ArraySchema, DateSchema } from "./built_in.ts";
import { describe, expect, it } from "../dev_deps.ts";
import { NullSchema, StringSchema } from "./scalers.ts";

describe("DateSchema", () => {
  it("should throw error when the value is not Date object", () => {
    expect(() => new DateSchema().assert({})).toThrow();
  });

  it("should not throw error when the value is valid", () => {
    expect(new DateSchema().assert(new Date())).toBeUndefined();
  });
});

describe("ArraySchema", () => {
  it("should throw error when the valid is not prototyped Array constructor", () => {
    expect(() => new ArraySchema().assert({})).toThrow();
    expect(() => new ArraySchema().assert("")).toThrow();
    expect(() => new ArraySchema().assert(null)).toThrow();
  });

  it("should throw error when the all schema is not satisfy", () => {
    expect(() => new ArraySchema([new StringSchema()]).assert([0])).toThrow();

    expect(() => new ArraySchema([new StringSchema()]).assert(["", " ", 0]))
      .toThrow();
    expect(() =>
      new ArraySchema([new StringSchema("test")]).assert(["test", "", "test"])
    )
      .toThrow();

    expect(() =>
      new ArraySchema([new StringSchema(), new NullSchema()]).assert([
        "",
        "",
        null,
        undefined,
        null,
      ])
    )
      .toThrow();
  });

  it("should throw error when array subtype is mixed definition and the value is not satisfy", () => {
    expect(() => new ArraySchema([1, new StringSchema()]).assert(["", "", 0]))
      .toThrow();

    expect(() => new ArraySchema([1, new StringSchema()]).assert(["", "", 0]))
      .toThrow();
  });

  it("should success when the value is empty array", () => {
    expect(new ArraySchema().assert([])).toBeUndefined();
    expect(new ArraySchema([1, ""]).assert([])).toBeUndefined();
  });

  it("should success when the subtype is raw value", () => {
    expect(new ArraySchema().assert([1, 2, 3])).toBeUndefined();
    expect(new ArraySchema([1, 2, 3]).assert([1, 1, 2, 3])).toBeUndefined();
  });

  it("should success when the subtype is schema", () => {
    expect(
      new ArraySchema([new StringSchema(), new NullSchema()]).assert([
        "",
        null,
        "test",
        null,
        null,
        "",
      ]),
    )
      .toBeUndefined();

    expect(
      new ArraySchema([1, new StringSchema(), null]).assert([
        "",
        "",
        1,
        "",
        null,
      ]),
    )
      .toBeUndefined();
  });
});
