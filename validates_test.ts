import {
  isIpv4Format,
  isIpv6Format,
  isSchema,
  isUriFormat,
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

describe("isUriFormat", () => {
  it("invalid", () => {
    expect(isUriFormat("")).toBeFalsy();
    expect(isUriFormat(":")).toBeFalsy();
    expect(isUriFormat("http")).toBeFalsy();
    expect(isUriFormat("http://::")).toBeFalsy();
    expect(isUriFormat("http://test.test##a")).toBeFalsy();
  });

  it("valid", () => {
    expect(isUriFormat("http:a")).toBeTruthy();
    expect(isUriFormat("http://0.0.0.0")).toBeTruthy();
    expect(isUriFormat("http://test.test")).toBeTruthy();
    expect(isUriFormat("http://test.test#a")).toBeTruthy();
    expect(isUriFormat("http:/::")).toBeTruthy();
    expect(isUriFormat("http:/a:b:c")).toBeTruthy();
    expect(isUriFormat("http:/username@a")).toBeTruthy();
    expect(isUriFormat("http:/username@:::8000")).toBeTruthy();
    expect(
      isUriFormat(
        "https://user:password@www.example.test:123/forum/questions/?tag=networking&order=newest#top",
      ),
    ).toBeTruthy();
  });
});
