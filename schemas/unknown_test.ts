import { PartialSchema } from "./unknowns.ts";
import { ObjectSchema } from "./objects.ts";
import { StringSchema } from "./scalers.ts";
import { describe, expect, it } from "../dev_deps.ts";

describe("PartialSchema", () => {
  it("should throw error when the value does not match prop value", () => {
    expect(() => new PartialSchema({ at: "test" }).assert("")).toThrow();
  });

  it("should throw error when the prop value is not schema and they are not equal", () => {
    expect(() => new PartialSchema({ a: {} }).assert({ a: {} })).toThrow();
  });

  it("should pass when the value does not have prop", () => {
    expect(new PartialSchema({ a: "" }).assert(null)).toBeUndefined();
    expect(new PartialSchema({ a: "", b: "" }).assert({}))
      .toBeUndefined();
    expect(new PartialSchema({ a: "", b: "" }).assert({ c: "" }))
      .toBeUndefined();
  });

  it("should pass when the value match to prop value", () => {
    expect(new PartialSchema({ a: "" }).assert({ a: "" })).toBeUndefined();
    expect(
      new PartialSchema({ a: "", b: 0, c: null, d: undefined }).assert({
        a: "",
        b: 0,
        c: null,
        d: undefined,
      }),
    ).toBeUndefined();
  });

  it("should pass when the base value is null", () => {
    expect(new PartialSchema(null).assert(null)).toBeUndefined();
  });

  it("should pass when the base value is undefined", () => {
    expect(new PartialSchema(undefined).assert(null)).toBeUndefined();
  });

  it("should pass when the prop value is schema", () => {
    expect(new PartialSchema({ a: new ObjectSchema() }).assert({ a: {} }))
      .toBeUndefined();

    expect(new PartialSchema({
      a: new ObjectSchema(),
      b: new ObjectSchema({
        c: new StringSchema(""),
      }),
    }).assert({
      a: {
        b: {
          c: "",
        },
      },
    }))
      .toBeUndefined();
  });
});
