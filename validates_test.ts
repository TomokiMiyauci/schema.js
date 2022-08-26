import { isSchema, validateSchema } from "./validates.ts";
import { describe, expect, it } from "./dev_deps.ts";
import { StringSchema } from "./mod.ts";
import { SchemaError } from "./errors.ts";

describe("isSchema", () => {
  it("should return false", () => {
    expect(isSchema(null)).toBeFalsy();
    expect(isSchema({})).toBeFalsy();
  });

  it("should pass when the value has functional assert property", () => {
    expect(isSchema(new StringSchema())).toBeTruthy();
    expect(isSchema({ assert: Function })).toBeTruthy();
  });
});

describe("validateSchema", () => {
  it("should return success validation result", () => {
    expect(validateSchema({ assert: () => {} }, "")).toEqual({
      pass: true,
      data: "",
    });

    expect(validateSchema({ assert: () => {} }, {})).toEqual({
      pass: true,
      data: {},
    });
  });

  it("should return fail validation result", () => {
    expect(validateSchema({
      assert: () => {
        throw Error();
      },
    }, "")).toEqual({
      pass: false,
      errors: [new SchemaError()],
    });
  });
});
