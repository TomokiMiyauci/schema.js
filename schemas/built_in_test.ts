import {
  NeverSchema,
  PartialSchema,
  RecordSchema,
  UnknownSchema,
} from "./built_in.ts";
import { ObjectSchema } from "./objects.ts";
import { NumberSchema, StringSchema } from "./scalers.ts";
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
        c: new StringSchema(),
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

describe("RecordSchema", () => {
  it("should throw error when the key is not exists", () => {
    expect(() => new RecordSchema("0", "").assert({})).toThrow();
    expect(() => new RecordSchema("", "").assert({ "a": "" })).toThrow();
  });

  it("should throw error when the value does not match", () => {
    expect(
      () =>
        new RecordSchema(Symbol.for(""), "").assert({
          [Symbol.for("")]: "",
          "": "",
        }),
    ).toThrow();

    expect(
      () =>
        new RecordSchema(new StringSchema(), "test").assert({
          "": "test",
          a: "test",
          b: "test",
          c: "",
        }),
    ).toThrow();

    expect(
      () =>
        new RecordSchema(new StringSchema(), new StringSchema()).assert({
          "": "test",
          a: "test",
          b: "test",
          c: 0,
        }),
    ).toThrow();
  });

  it("should pass when key and value is raw value", () => {
    expect(new RecordSchema("", "").assert({ "": "" })).toBeUndefined();
    expect(new RecordSchema("0", "").assert({ "0": "" })).toBeUndefined();
    expect(new RecordSchema("0", "").assert({ 0: "" })).toBeUndefined();
    expect(
      new RecordSchema(Symbol.for(""), "").assert({ [Symbol.for("")]: "" }),
    ).toBeUndefined();
  });

  it("should pass when key is schema", () => {
    expect(new RecordSchema(new StringSchema(), "").assert({})).toBeUndefined();
    expect(
      new RecordSchema(new StringSchema(), new StringSchema()).assert({
        a: "a",
        b: "b",
        c: "c",
      }),
    )
      .toBeUndefined();

    expect(
      new RecordSchema(new StringSchema(), new NumberSchema()).assert({
        a: 1,
        b: 2,
        c: 3,
      }),
    )
      .toBeUndefined();

    expect(
      new RecordSchema(new StringSchema(), new NumberSchema()).assert({
        0: 1,
        1: 2,
        2: 3,
      }),
    )
      .toBeUndefined();
  });

  it("should pass when the key is exists and the value is matched", () => {
    expect(new RecordSchema("0", "").assert({ 0: "" })).toBeUndefined();
    expect(
      new RecordSchema(new StringSchema(), "test").assert({
        "": "test",
        a: "test",
        b: "test",
        c: "test",
      }),
    ).toBeUndefined();
  });
});

describe("UnknownSchema", () => {
  it("should return whenever", () => {
    expect(new UnknownSchema().assert("")).toBeUndefined();
    expect(new UnknownSchema().assert(0)).toBeUndefined();
    expect(new UnknownSchema().assert(true)).toBeUndefined();
    expect(new UnknownSchema().assert({})).toBeUndefined();
  });
});

describe("NeverSchema", () => {
  it("should throw error always", () => {
    expect(() => new NeverSchema().assert("")).toThrow();
    expect(() => new NeverSchema().assert(1)).toThrow();
    expect(() => new NeverSchema().assert({})).toThrow();
  });
});
