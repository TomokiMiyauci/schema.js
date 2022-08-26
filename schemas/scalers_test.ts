import {
  BigintSchema,
  BooleanSchema,
  NullSchema,
  NumberSchema,
  StringSchema,
  SymbolSchema,
  UndefinedSchema,
} from "./scalers.ts";
import { describe, expect, it } from "../dev_deps.ts";

describe("BooleanSchema", () => {
  it("should throw error when the value is not boolean", () => {
    expect(() => new BooleanSchema().assert(undefined)).toThrow();
    expect(() => new BooleanSchema().assert(null)).toThrow();
  });

  it("should throw error when the value is not satisfy with subtype", () => {
    expect(() => new BooleanSchema(true).assert(false)).toThrow();
    expect(() => new BooleanSchema(false).assert(true)).toThrow();
  });

  it("should return undefined when the value is satisfy", () => {
    expect(new BooleanSchema().assert(true)).toBeUndefined();
    expect(new BooleanSchema(true).assert(true)).toBeUndefined();
  });
});

describe("StringSchema", () => {
  it("should throw error when the value is not string", () => {
    expect(() => new StringSchema().assert(undefined)).toThrow();
    expect(() => new StringSchema().assert(null)).toThrow();
  });

  it("should throw error when the value is not satisfy with subtype", () => {
    expect(() => new StringSchema("test").assert("")).toThrow();
    expect(() => new StringSchema("").assert("a")).toThrow();
  });

  it("should return undefined when the value is satisfy", () => {
    expect(new StringSchema().assert("test")).toBeUndefined();
    expect(new StringSchema("test").assert("test")).toBeUndefined();
  });
});

describe("NumberSchema", () => {
  it("should throw error when the value is not number", () => {
    expect(() => new NumberSchema().assert(undefined)).toThrow();
    expect(() => new NumberSchema().assert(null)).toThrow();
  });

  it("should throw error when the value is not satisfy with subtype", () => {
    expect(() => new NumberSchema(1).assert(0)).toThrow();
    expect(() => new NumberSchema(0).assert(0n)).toThrow();
  });

  it("should return undefined when the value is satisfy", () => {
    expect(new NumberSchema().assert(0)).toBeUndefined();
    expect(new NumberSchema(1).assert(1)).toBeUndefined();
  });
});

describe("BigintSchema", () => {
  it("should throw error when the value is not bigint", () => {
    expect(() => new BigintSchema().assert(undefined)).toThrow();
    expect(() => new BigintSchema().assert(null)).toThrow();
  });

  it("should throw error when the value is not satisfy with subtype", () => {
    expect(() => new BigintSchema(0n).assert(0)).toThrow();
    expect(() => new BigintSchema(0n).assert(1n)).toThrow();
  });

  it("should return undefined when the value is satisfy", () => {
    expect(new BigintSchema().assert(0n)).toBeUndefined();
    expect(new BigintSchema(1n).assert(1n)).toBeUndefined();
  });
});

describe("NullSchema", () => {
  it("should throw error when the value is not null", () => {
    expect(() => new NullSchema().assert(undefined)).toThrow();
    expect(() => new NullSchema().assert(0)).toThrow();
    expect(new NullSchema().assert(null)).toBeUndefined();
  });
});

describe("UndefinedSchema", () => {
  it("should throw error when the value is not undefined", () => {
    expect(() => new UndefinedSchema().assert(null)).toThrow();
    expect(() => new UndefinedSchema().assert(0)).toThrow();
    expect(new UndefinedSchema().assert(undefined)).toBeUndefined();
  });
});

describe("SymbolSchema", () => {
  it("should throw error when the value is not symbol", () => {
    expect(() => new SymbolSchema().assert(null)).toThrow();
    expect(() => new SymbolSchema().assert(0)).toThrow();
    expect(new SymbolSchema().assert(Symbol(""))).toBeUndefined();
  });
});
