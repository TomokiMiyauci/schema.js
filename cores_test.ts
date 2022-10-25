import {
  array,
  bigint,
  boolean,
  func,
  number,
  object,
  omit,
  pick,
  record,
  string,
  symbol,
} from "./cores.ts";
import { assertEquals, describe, it } from "./dev_deps.ts";
import { and } from "./operators.ts";
import { pattern } from "./subsets.ts";

const MESSAGE = "custom message";

describe("string", () => {
  it("should return issue when input type is not string", () => {
    assertEquals([...string().check(0)], [{
      message: "expected string, actual number",
    }]);
  });

  it("message override", () => {
    assertEquals([...string(MESSAGE).check(0)], [{ message: MESSAGE }]);
  });

  it("should return empty list when input type is string", () => {
    assertEquals([...string().check("")], []);
  });
});

describe("number", () => {
  it("should return issue when input type is not number", () => {
    assertEquals([...number().check("")], [{
      message: "expected number, actual string",
    }]);
  });

  it("message override", () => {
    assertEquals([...number(MESSAGE).check("")], [{ message: MESSAGE }]);
  });

  it("should return empty list when input type is number", () => {
    assertEquals([...number().check(0)], []);
  });
});

describe("bigint", () => {
  it("should return issue when input type is not bigint", () => {
    assertEquals([...bigint().check("")], [{
      message: "expected bigint, actual string",
    }]);
  });

  it("message override", () => {
    assertEquals([...bigint(MESSAGE).check("")], [{ message: MESSAGE }]);
  });

  it("should return empty list when input type is bigint", () => {
    assertEquals([...bigint().check(0n)], []);
  });
});

describe("boolean", () => {
  it("should return issue when input type is not boolean", () => {
    assertEquals([...boolean().check("")], [{
      message: "expected boolean, actual string",
    }]);
  });

  it("message override", () => {
    assertEquals([...boolean(MESSAGE).check("")], [{ message: MESSAGE }]);
  });

  it("should return empty list when input type is boolean", () => {
    assertEquals([...boolean().check(true)], []);
  });
});

describe("func", () => {
  it("should return issue when input type is not Function", () => {
    assertEquals([...func().check("")], [{
      message: "expected function, actual string",
    }]);
  });

  it("message override", () => {
    assertEquals([...func(MESSAGE).check("")], [{ message: MESSAGE }]);
  });

  it("should return empty list when input type is Function", () => {
    assertEquals([...func().check(() => {})], []);
  });
});

describe("symbol", () => {
  it("should return issue when input type is not symbol", () => {
    assertEquals([...symbol().check("")], [{
      message: "expected symbol, actual string",
    }]);
  });

  it("message override", () => {
    assertEquals([...symbol(MESSAGE).check("")], [{ message: MESSAGE }]);
  });

  it("should return empty list when input type is symbol", () => {
    assertEquals([...symbol().check(Symbol.iterator)], []);
  });
});

describe("object", () => {
  it("should return issue when input type is not symbol", () => {
    assertEquals([...object().check("")], [{
      message: "expected object, actual string",
    }]);
  });

  it("should return property not exist issue when the property not exist", () => {
    assertEquals([
      ...object({ a: string() }).check({}),
    ], [{
      message: "property does not exist",
      paths: ["a"],
    }]);
  });

  it("should return multiple property not exist issues when the property not exist", () => {
    assertEquals([
      ...object({ a: string(), b: string() }).check({}),
    ], [{
      message: "property does not exist",
      paths: ["a"],
    }, {
      message: "property does not exist",
      paths: ["b"],
    }]);
  });

  it("should return multiple property not exist issues when nested object is passed", () => {
    assertEquals([
      ...object({ a: object({ b: string() }) }).check({ a: {} }),
    ], [{
      message: "property does not exist",
      paths: ["a", "b"],
    }]);
  });

  it("should return empty list when additional property is exist", () => {
    assertEquals([
      ...object({ a: string() }).check({ a: "", b: "" }),
    ], []);
  });

  it("should return empty list when input type is object", () => {
    assertEquals([...object().check(new Object())], []);
  });
});

describe("array", () => {
  it("should return issue when input is not Array", () => {
    assertEquals([...array().check("")], [{
      message: "expected Array, actual String",
    }]);
  });

  it("message override", () => {
    assertEquals([...array(MESSAGE).check("")], [{ message: MESSAGE }]);
  });

  it("should return empty list when input is Array", () => {
    assertEquals([
      ...array().check([]),
    ], []);
  });
});

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
    ], [{ message: "property does not exist", paths: ["a"] }]);
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
    ], [{ message: "property does not exist", paths: ["b"] }]);
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
