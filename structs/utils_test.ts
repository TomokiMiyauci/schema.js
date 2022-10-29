import { number, object, string } from "./cores.ts";
import { nullable, omit, optional, partial, pick, record } from "./utils.ts";
import { assertEquals, describe, it } from "../dev_deps.ts";
import { and } from "./operators.ts";
import { pattern } from "./subsets.ts";

const MESSAGE = "custom message";

describe("record", () => {
  it("should return issue when input is not object", () => {
    assertEquals([...record(string(), string()).check("")], [{
      message: `expected object, actual string`,
    }]);
  });

  it("message override", () => {
    assertEquals([...record(string(), string(), MESSAGE).check("")], [{
      message: MESSAGE,
    }]);
  });

  it("should return issue when input does not satisfy value", () => {
    assertEquals([...record(string(), string()).check({ 1: {} })], [{
      message: `expected string, actual object`,
      paths: ["1"],
    }]);
  });

  it("should return issue when input does not satisfy key", () => {
    assertEquals([
      ...record(and(string()).and(pattern(/^t/)), string()).check({ "a": "" }),
    ], [{
      message: `expected match /^t/, actual not match`,
      paths: ["a"],
    }]);
  });

  it("should return issue when input does not satisfy key and value", () => {
    assertEquals([
      ...record(and(string()).and(pattern(/^t/)), string()).check({ "a": 0 }),
    ], [{
      message: `expected match /^t/, actual not match`,
      paths: ["a"],
    }, {
      message: `expected string, actual number`,
      paths: ["a"],
    }]);
  });

  it("should return empty list when input satisfy key and value", () => {
    assertEquals([
      ...record(and(string()).and(pattern(/^t/)), string()).check({ "t": "" }),
    ], []);
  });
});

describe("pick", () => {
  it("should return picked definition", () => {
    const String = string();
    const Number = number();
    const O = object({ a: String, b: Number, c: Number });
    const Pick = pick(O, ["a", "b"]);

    assertEquals(O.definition.a, String);
    assertEquals(O.definition.b, Number);
    assertEquals(O.definition.c, Number);
    assertEquals(Object.keys(Pick.definition), ["a", "b"]);
    assertEquals(Object.keys(pick(Pick, ["a"]).definition), ["a"]);
  });

  it("should return issue when picked struct does not satisfy", () => {
    assertEquals([
      ...pick(object({ a: string(), b: string() }), ["a"]).check({}),
    ], [{ message: "expected string, actual undefined", paths: ["a"] }]);
  });

  it("should return empty list when picked struct satisfy", () => {
    const O = object({ a: string(), b: string(), c: string() });
    const firstPick = pick(O, ["a", "b"]);
    assertEquals([
      ...pick(firstPick, ["a"])
        .check(
          { a: "" },
        ),
    ], []);
  });
});

describe("omit", () => {
  it("should return omitted definition", () => {
    const String = string();
    const Number = number();
    const O = object({ a: String, b: Number, c: Number });
    const Omit = omit(O, ["a"]);

    assertEquals(O.definition.a, String);
    assertEquals(O.definition.b, Number);
    assertEquals(O.definition.c, Number);
    assertEquals(Object.keys(Omit.definition), ["b", "c"]);
  });

  it("should return issue when omitted struct does not satisfy", () => {
    assertEquals([
      ...omit(object({ a: string(), b: string() }), ["a"]).check({}),
    ], [{ message: "expected string, actual undefined", paths: ["b"] }]);
  });

  it("should return empty list when omitted struct satisfy", () => {
    const O = object({ a: string(), b: string(), c: string() });
    const firstPick = omit(O, ["a"]);
    assertEquals([
      ...omit(firstPick, ["b"])
        .check(
          { c: "" },
        ),
    ], []);
  });
});

describe("partial", () => {
  it("should return empty list when input satisfy struct", () => {
    const String = string();
    const Number = number();
    const O = object({ a: String, b: Number, c: Number });

    assertEquals([...partial(O).check({})], []);
  });

  it("should return empty list when input satisfy struct", () => {
    const String = string();
    const Number = number();
    const O = object({ a: String, b: Number, c: Number });

    assertEquals([...partial(O).check({ a: 0 })], [{
      message: "expected (undefined | string), actual 0",
      paths: ["a"],
    }]);
  });
});

describe("nullable", () => {
  it("should return wrapped struct", () => {
    const inner = string();

    assertEquals(nullable(inner).unwrap(), inner);
    assertEquals(nullable(inner).toString(), `(string | null)`);
    assertEquals([...nullable(inner).check("")], []);
  });

  it("should return nested wrapped struct", () => {
    const inner = string();

    assertEquals(nullable(nullable(inner)).unwrap().unwrap(), inner);
  });

  it("should return issue when input does not satisfy struct", () => {
    assertEquals([...nullable(string()).check(0)], [{
      message: `expected (string | null), actual 0`,
    }]);
  });

  it("message override", () => {
    assertEquals([...nullable(string(), MESSAGE).check(0)], [{
      message: MESSAGE,
    }]);
  });

  it("should return empty list when input satisfy struct", () => {
    const strOrNull = nullable(string());

    assertEquals([...strOrNull.check("")], []);
    assertEquals([...strOrNull.check(null)], []);
  });
});

describe("optional", () => {
  it("should return wrapped struct", () => {
    const inner = string();

    assertEquals(optional(inner).unwrap(), inner);
    assertEquals(optional(inner).toString(), `(string | undefined)`);
    assertEquals([...optional(inner).check("")], []);
  });

  it("should return nested wrapped struct", () => {
    const inner = string();

    assertEquals(optional(optional(inner)).unwrap().unwrap(), inner);
  });

  it("should return issue when input does not satisfy struct", () => {
    assertEquals([...optional(string()).check(0)], [{
      message: `expected (string | undefined), actual 0`,
    }]);
  });

  it("message override", () => {
    assertEquals([...optional(string(), MESSAGE).check(0)], [{
      message: MESSAGE,
    }]);
  });

  it("should return empty list when input satisfy struct", () => {
    const strOrUndefined = optional(string());

    assertEquals([...strOrUndefined.check("")], []);
    assertEquals([...strOrUndefined.check(undefined)], []);
  });
});
