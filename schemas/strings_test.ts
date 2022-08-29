import {
  DateFormatSchema,
  DateTimeFormatSchema,
  EmailFormatSchema,
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
