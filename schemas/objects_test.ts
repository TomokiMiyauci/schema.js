import { assertSchemaRecord, ObjectSchema } from "./objects.ts";
import { describe, expect, it } from "../dev_deps.ts";
import {
  NullSchema,
  NumberSchema,
  StringSchema,
  UndefinedSchema,
} from "./scalers.ts";
import { assertObject } from "../deps.ts";

describe("assertSchemaRecord", () => {
  it("should throw error", () => {
    expect(() => assertSchemaRecord({ a: new StringSchema() }, {})).toThrow();
  });

  it("should throw error when the key is not exists", () => {
    expect(() =>
      assertSchemaRecord({
        a: new UndefinedSchema(),
      }, {})
    ).toThrow();
  });

  it("should throw error when the nested schema record is invalid", () => {
    expect(
      () =>
        assertSchemaRecord({
          a: {
            assert(value: unknown): asserts value is object {
              assertObject(value);

              assertSchemaRecord({
                b: new StringSchema(),
              }, value);
            },
          },
        }, { a: { b: 0 } }),
    ).toThrow();
  });

  it("should not throw error", () => {
    const record = { a: new StringSchema() };
    expect(assertSchemaRecord(record, { a: "" })).toBeUndefined();
  });

  it("should not throw error when the schema record is nested object", () => {
    expect(
      assertSchemaRecord({
        a: {
          assert(value: unknown): asserts value is object {
            assertObject(value);

            assertSchemaRecord({
              b: new StringSchema(),
            }, value);
          },
        },
      }, { a: { b: "" } }),
    ).toBeUndefined();
  });
});

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
