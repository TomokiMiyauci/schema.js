import { ObjectSchema } from "./objects.ts";
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
