import {
  DateFormatSchema,
  DateTimeFormatSchema,
  EmailFormatSchema,
  HostnameFormatSchema,
  Ipv4FormatSchema,
  Ipv6FormatSchema,
  PatternSchema,
  TimeFormatSchema,
  UrlFormatSchema,
  UuidFormatSchema,
} from "./strings.ts";
import { describe, expect, it } from "../dev_deps.ts";

describe("EmailFormatSchema", () => {
  it("should throw error when the value is not email format", () => {
    expect(() => new EmailFormatSchema().assert?.("")).toThrow();
  });

  it("should not throw error when the value is email format", () => {
    expect(() => new EmailFormatSchema().assert?.("test@test.test")).not
      .toThrow();
  });
});

describe("UuidFormatSchema", () => {
  it("should throw error when the value is invalid UUID format", () => {
    expect(() => new UuidFormatSchema().assert("")).toThrow();
  });

  it("should return undefined when the value is UUID format", () => {
    expect(
      new UuidFormatSchema().assert("6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b"),
    ).toBeUndefined();
  });
});

describe("UrlFormatSchema", () => {
  it("should throw error when the value is invalid URL format", () => {
    expect(() => new UrlFormatSchema().assert("")).toThrow();
  });

  it("should return undefined when the value is URL format", () => {
    expect(
      new UrlFormatSchema().assert("http://a"),
    ).toBeUndefined();
  });
});

describe("DateFormatSchema", () => {
  it("should throw error when the value is invalid date format", () => {
    expect(() => new DateFormatSchema().assert("0000-00-00")).toThrow();
    expect(() => new DateFormatSchema().assert("")).toThrow();
  });

  it("should return undefined when the value is date format", () => {
    expect(new DateFormatSchema().assert("2000-01-01")).toBeUndefined();
  });
});

describe("TimeFormatSchema", () => {
  it("should throw error when the value is invalid time format", () => {
    expect(() => new TimeFormatSchema().assert("00:00:00")).toThrow();
    expect(() => new TimeFormatSchema().assert("00:00:00:X")).toThrow();
  });

  it("should return undefined when the value is time format", () => {
    expect(new TimeFormatSchema().assert("00:00:00Z")).toBeUndefined();
    expect(new TimeFormatSchema().assert("00:00:00+00:00")).toBeUndefined();
  });
});

describe("DateTimeFormatSchema", () => {
  it("should throw error when the value is invalid time format", () => {
    expect(() => new DateTimeFormatSchema().assert("")).toThrow();
    expect(() => new DateTimeFormatSchema().assert("0000-00-00T00:00:00Z"))
      .toThrow();
  });

  it("should return undefined when the value is time format", () => {
    expect(new DateTimeFormatSchema().assert("1000-01-01T00:00:00+00:00"))
      .toBeUndefined();
  });
});

describe("HostnameFormatSchema", () => {
  it("should throw error when the value is invalid hostname format", () => {
    expect(() => new HostnameFormatSchema().assert("")).toThrow();
    expect(() => new HostnameFormatSchema().assert("a."))
      .toThrow();
  });

  it("should return undefined when the value is hostname format", () => {
    expect(new HostnameFormatSchema().assert("a.a"))
      .toBeUndefined();
  });
});

describe("PatternSchema", () => {
  it("should throw error when the value does not match pattern", () => {
    expect(() => new PatternSchema(/^a/).assert("b"))
      .toThrow();
    expect(() =>
      new PatternSchema(/^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$/).assert(
        "(888)555-1212 ext. 532",
      )
    ).toThrow();
  });

  it("should return undefined when the value match pattern", () => {
    expect(
      new PatternSchema(/^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$/).assert(
        "555-1212",
      ),
    )
      .toBeUndefined();
  });
});

describe("Ipv4FormatSchema", () => {
  it("should throw error when the value does not match pattern", () => {
    expect(() => new Ipv4FormatSchema().assert("")).toThrow();
    expect(() => new Ipv4FormatSchema().assert("256.256.256.256")).toThrow();
  });

  it("should return undefined when the value match pattern", () => {
    expect(new Ipv4FormatSchema().assert("0.0.0.0")).toBeUndefined();
  });
});

describe("Ipv6FormatSchema", () => {
  it("should throw error when the value is invalid IPv6 format", () => {
    expect(() => new Ipv6FormatSchema().assert("")).toThrow();
    expect(() => new Ipv6FormatSchema().assert(":")).toThrow();
  });

  it("should return undefined when the is IPv6 format", () => {
    expect(new Ipv6FormatSchema().assert("::")).toBeUndefined();
  });
});
