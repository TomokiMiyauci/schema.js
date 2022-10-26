import {
  array,
  bigint,
  boolean,
  func,
  instance,
  number,
  object,
  string,
  symbol,
  value,
} from "./cores.ts";
import { assertEquals, describe, it } from "../dev_deps.ts";

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

describe("value", () => {
  it("should return issue when input does not equal to definition", () => {
    assertEquals([...value(0).check(1)], [{ message: "expected 0, actual 1" }]);
  });

  it("message override", () => {
    assertEquals([...value(0, MESSAGE).check(1)], [{ message: MESSAGE }]);
  });

  it("should return empty list when input equal to definition", () => {
    assertEquals([...value("").check("")], []);
  });
});

describe("object", () => {
  it("should return issue when input type is not symbol", () => {
    assertEquals([...object().check("")], [{
      message: "expected object, actual string",
    }]);
  });

  it("should return issue when the property not exist", () => {
    assertEquals([
      ...object({ a: string() }).check({}),
    ], [{
      message: "expected string, actual undefined",
      paths: ["a"],
    }]);
  });

  it("should return multiple issues when the properties not exist", () => {
    assertEquals([
      ...object({ a: string(), b: string() }).check({}),
    ], [{
      message: "expected string, actual undefined",
      paths: ["a"],
    }, {
      message: "expected string, actual undefined",
      paths: ["b"],
    }]);
  });

  it("should return multiple issues when nested object is passed", () => {
    assertEquals([
      ...object({ a: object({ b: string() }) }).check({ a: {} }),
    ], [{
      message: "expected string, actual undefined",
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
describe("instance", () => {
  it("should return issue when input is not instance of definition", () => {
    assertEquals([...instance(Array).check(null)], [{
      message: "expected instance of Array, actual null",
    }]);
  });

  it("message override", () => {
    assertEquals([...instance(Array, MESSAGE).check(null)], [{
      message: MESSAGE,
    }]);
  });

  it("should return empty issue when input is instance of definition", () => {
    assertEquals([...instance(Array).check([])], []);
  });
});
