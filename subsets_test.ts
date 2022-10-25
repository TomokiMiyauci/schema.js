import {
  empty,
  list,
  maximum,
  maxSize,
  minimum,
  minSize,
  nonempty,
  pattern,
  tuple,
} from "./subsets.ts";
import { assertEquals, describe, it } from "./dev_deps.ts";
import { number, object, string } from "./cores.ts";

describe("maximum", () => {
  it("should return issue when the input exceed max", () => {
    assertEquals([...maximum(5).check(6)], [{
      message: "expected less than or equal to 5, actual 6",
    }]);
  });

  it("should return empty list when the input less than or equal to", () => {
    assertEquals([...maximum(5).check(5)], []);
  });
});

describe("minimum", () => {
  it("should return issue when the input exceed min", () => {
    assertEquals([...minimum(5).check(4)], [{
      message: "expected greater than or equal to 5, actual 4",
    }]);
  });

  it("should return empty list when the input greater than or equal to", () => {
    assertEquals([...minimum(5).check(5)], []);
  });
});

describe("maxSize", () => {
  it("should return issue when the input element exceed max size", () => {
    assertEquals([...maxSize(5).check("a".repeat(6))], [{
      message: "expected less than or equal to 5 elements, actual 6 elements",
    }]);
  });

  it("should return empty list when the input element less than or equal to size", () => {
    assertEquals([...maxSize(5).check("a".repeat(5))], []);
  });
});

describe("minSize", () => {
  it("should return issue when the input element less than min size", () => {
    assertEquals([...minSize(5).check("a".repeat(4))], [{
      message:
        "expected greater than or equal to 5 elements, actual 4 elements",
    }]);
  });

  it("should return empty list when the input element greater than or equal to size", () => {
    assertEquals([...minSize(5).check("a".repeat(5))], []);
  });
});

describe("empty", () => {
  it("should return issue when the input is non empty", () => {
    assertEquals([...empty().check("a")], [{
      message: "expected empty, actual 1 element",
    }]);
  });

  it("should return issue with plural when the input is non empty", () => {
    assertEquals([...empty().check("aa")], [{
      message: "expected empty, actual 2 elements",
    }]);
  });

  it("should return empty list when the input is empty", () => {
    assertEquals([...empty().check([])], []);
  });
});

describe("nonempty", () => {
  it("should return issue when the input is empty", () => {
    assertEquals([...nonempty().check("")], [{
      message: "expected non empty, actual empty",
    }]);
  });

  it("should return empty list when the input is non empty", () => {
    assertEquals([...nonempty().check([""])], []);
  });
});

describe("pattern", () => {
  it("should return issue when the input does not match regexp", () => {
    assertEquals([
      ...pattern(/^t/).check("not match"),
    ], [{ message: "expected match /^t/, actual not match" }]);
  });

  it("should return empty list when the input match regexp", () => {
    assertEquals([...pattern(/t/).check("test")], []);
  });
});

describe("list", () => {
  it("should return issue when the input does not satisfy child struct", () => {
    assertEquals([...list(string()).check([0, "", {}])], [
      { message: "expected string, actual number", paths: ["0"] },
      { message: "expected string, actual object", paths: ["2"] },
    ]);
  });

  it("should return issue when the input does not satisfy nested child struct", () => {
    assertEquals([...list(object({ a: string() })).check([0, "", {}])], [
      { message: "expected object, actual number", paths: ["0"] },
      { message: "expected object, actual string", paths: ["1"] },
      { message: "property does not exist", paths: ["2", "a"] },
    ]);
  });

  it("should return empty list when the input satisfy child struct", () => {
    assertEquals([
      ...list(string()).check(["", "a", "b"]),
    ], []);
  });
});

describe("tuple", () => {
  it("should return issue when the input does not satisfy children struct", () => {
    assertEquals([...tuple([string(), number()]).check([0, "", {}])], [
      { message: "expected string, actual number", paths: ["0"] },
      { message: "expected number, actual string", paths: ["1"] },
      { message: "expected never, actual [object Object]", paths: ["2"] },
    ]);
  });

  it("should return issue when the input does not satisfy nested children struct", () => {
    assertEquals([...tuple([object({ a: string() })]).check([{}])], [
      { message: "property does not exist", paths: ["0", "a"] },
    ]);
  });

  it("should return empty list when the input satisfy children struct", () => {
    assertEquals([
      ...tuple([string(), number(), object()]).check(["", 0, {}]),
    ], []);
  });
});
