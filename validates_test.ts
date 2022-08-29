import {
  isDateFormat,
  isDateTimeFormat,
  isHostnameFormat,
  isIpv4Format,
  isIpv6Format,
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

describe("isIpv4Format", () => {
  it("invalid", () => {
    expect(isIpv4Format("")).toBeFalsy();
    expect(isIpv4Format("0")).toBeFalsy();
    expect(isIpv4Format("00.0.0.0")).toBeFalsy();
    expect(isIpv4Format("30.168.1.255.1")).toBeFalsy();
    expect(isIpv4Format("127.1")).toBeFalsy();
    expect(isIpv4Format("192.168.1.256")).toBeFalsy();
    expect(isIpv4Format("-1.2.3.4")).toBeFalsy();
    expect(isIpv4Format("1.1.1.1.")).toBeFalsy();
    expect(isIpv4Format("3...3")).toBeFalsy();
    expect(isIpv4Format("1.1.1.01")).toBeFalsy();
  });

  it("valid", () => {
    expect(isIpv4Format("127.0.0.1")).toBeTruthy();
    expect(isIpv4Format("255.255.255.255")).toBeTruthy();
    expect(isIpv4Format("0.0.0.0")).toBeTruthy();
  });
});

describe("isIpv6Format", () => {
  it("invalid", () => {
    expect(isIpv6Format("")).toBeFalsy();
    expect(isIpv6Format(":")).toBeFalsy();
    expect(isIpv6Format("a")).toBeFalsy();
  });

  it("valid", () => {
    expect(isIpv6Format("::")).toBeTruthy();
    expect(isIpv6Format("1:2:3:4:5:6:7:8")).toBeTruthy();
    expect(isIpv6Format("1::")).toBeTruthy();
    expect(isIpv6Format("1:2:3:4:5:6:7::")).toBeTruthy();
    expect(isIpv6Format("1::8")).toBeTruthy();
    expect(isIpv6Format("1::7:8")).toBeTruthy();
    expect(isIpv6Format("1::6:7:8")).toBeTruthy();
    expect(isIpv6Format("1::5:6:7:8")).toBeTruthy();
    expect(isIpv6Format("1::4:5:6:7:8")).toBeTruthy();
    expect(isIpv6Format("1::3:4:5:6:7:8")).toBeTruthy();
    expect(isIpv6Format("::2:3:4:5:6:7:8")).toBeTruthy();
    expect(isIpv6Format("2001:db8:3:4::192.0.2.33")).toBeTruthy();
  });
});
