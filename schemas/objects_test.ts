import { ArraySchema, DateSchema, ObjectSchema } from "./objects.ts";
import { describe, expect, it } from "../dev_deps.ts";
import {
  NullSchema,
  NumberSchema,
  StringSchema,
  UndefinedSchema,
} from "./scalers.ts";

describe("ObjectSchema", () => {
  it("should throw error when the data type is not object", () => {
    expect(() => new ObjectSchema().assert("")).toThrow();
  });

  it("should not throw error when the data type is object", () => {
    expect(new ObjectSchema().assert({})).toBeUndefined();
    expect(new ObjectSchema().assert([])).toBeUndefined();
    expect(new ObjectSchema().assert(new Date())).toBeUndefined();
  });

  it("should not pass the assert when pass the nested object", () => {
    const schema = new ObjectSchema({
      a: new ObjectSchema({
        a: new ObjectSchema({
          a: new ObjectSchema({
            b: new StringSchema("test"),
          }),
        }),
      }),
    });

    expect(
      () =>
        schema.assert({
          a: {
            a: {
              a: {
                b: "",
              },
            },
          },
        }),
    ).toThrow();
  });

  it("should pass the assert when pass the simple object", () => {
    const schema = new ObjectSchema({
      a: new StringSchema(),
      b: new NumberSchema(),
      c: new NullSchema(),
      d: new UndefinedSchema(),
    });

    expect(
      schema.assert({
        a: "",
        b: 0,
        c: null,
        d: undefined,
      }),
    ).toBeUndefined();
  });

  it("should pass the assert when pass the nested object", () => {
    const schema = new ObjectSchema({
      a: new ObjectSchema({
        a: new ObjectSchema({
          a: new ObjectSchema({
            b: new StringSchema(""),
          }),
        }),
      }),
    });

    expect(
      schema.assert({
        a: {
          a: {
            a: {
              b: "",
            },
          },
        },
      }),
    ).toBeUndefined();
  });
});

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
