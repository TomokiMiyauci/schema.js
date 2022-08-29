import {
  isDateFormat,
  isDateTimeFormat,
  isHostnameFormat,
  isSchema,
  isTimeFormat,
  validateSchema,
} from "./validates.ts";
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

describe("isDateFormat", () => {
  it("invalid", () => {
    expect(isDateFormat("")).toBeFalsy();
    expect(isDateFormat("0000-00-00")).toBeFalsy();
    expect(isDateFormat("9999-99-99")).toBeFalsy();
    expect(isDateFormat("9999-20-01")).toBeFalsy();
    expect(isDateFormat("9999-20-00")).toBeFalsy();
    expect(isDateFormat("9999-12-00")).toBeFalsy();
    expect(isDateFormat("9999-12-32")).toBeFalsy();
    expect(isDateFormat("9999-02-29")).toBeFalsy();
    expect(isDateFormat("1000-11-31")).toBeFalsy();
    expect(isDateFormat("1000-09-31")).toBeFalsy();
    expect(isDateFormat("1000-06-31")).toBeFalsy();
    expect(isDateFormat("1000-04-31")).toBeFalsy();
    expect(isDateFormat("1000-02-31")).toBeFalsy();
  });

  it("valid", () => {
    expect(isDateFormat("2000-01-01")).toBeTruthy();
    expect(isDateFormat("2000-12-31")).toBeTruthy();
    expect(isDateFormat("2000-11-30")).toBeTruthy();
    expect(isDateFormat("9999-01-01")).toBeTruthy();
    expect(isDateFormat("9999-02-28")).toBeTruthy();
    expect(isDateFormat("2012-01-31")).toBeTruthy();
    expect(isDateFormat("1000-03-31")).toBeTruthy();
    expect(isDateFormat("1000-05-31")).toBeTruthy();
    expect(isDateFormat("1000-07-31")).toBeTruthy();
    expect(isDateFormat("1000-08-31")).toBeTruthy();
    expect(isDateFormat("1000-10-31")).toBeTruthy();
    expect(isDateFormat("1000-12-31")).toBeTruthy();
  });
});

describe("isTimeFormat", () => {
  it("invalid", () => {
    expect(isTimeFormat("")).toBeFalsy();
    expect(isTimeFormat("30:00:00+00:00")).toBeFalsy();
    expect(isTimeFormat("00:60:00+00:00")).toBeFalsy();
    expect(isTimeFormat("24:00:00+00:00")).toBeFalsy();
    expect(isTimeFormat("23:00:60+00:00")).toBeFalsy();
    expect(isTimeFormat("00:00:00$00:00")).toBeFalsy();
    expect(isTimeFormat("00:00:00+20:00")).toBeFalsy();
    expect(isTimeFormat("00:00:00-20:00")).toBeFalsy();
  });

  it("valid", () => {
    expect(isTimeFormat("00:00:00+00:00")).toBeTruthy();
    expect(isTimeFormat("23:59:59+19:59")).toBeTruthy();
    expect(isTimeFormat("23:59:59Z")).toBeTruthy();
  });
});

describe("isDateTimeFormat", () => {
  it("invalid", () => {
    expect(isDateTimeFormat("")).toBeFalsy();
    expect(isDateTimeFormat("0000-00-00T00:00:00Z")).toBeFalsy();
    expect(isDateTimeFormat("1000-01-01T00:00:00+20:00")).toBeFalsy();
  });

  it("valid", () => {
    expect(isDateTimeFormat("1000-01-01T00:00:00Z")).toBeTruthy();
    expect(isDateTimeFormat("1000-01-01T00:00:00+00:00")).toBeTruthy();
    expect(isDateTimeFormat("9999-12-31T23:59:59+19:59")).toBeTruthy();
  });
});

describe("isHostnameFormat", () => {
  it("invalid", () => {
    expect(isHostnameFormat("")).toBeFalsy();
    expect(isHostnameFormat("a.")).toBeFalsy();
    expect(isHostnameFormat("a".repeat(64))).toBeFalsy();
    expect(isHostnameFormat("a".repeat(63) + "." + "a".repeat(64))).toBeFalsy();
  });

  it("valid", () => {
    expect(isHostnameFormat("a")).toBeTruthy();
    expect(isHostnameFormat("a.a")).toBeTruthy();
    expect(isHostnameFormat("a".repeat(63))).toBeTruthy();
    expect(isHostnameFormat("a".repeat(63) + "." + "a".repeat(63)))
      .toBeTruthy();
  });
});
