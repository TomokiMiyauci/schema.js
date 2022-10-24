import { empty, nonempty } from "./subsets.ts";
import { assertEquals, describe, it } from "./dev_deps.ts";

describe("empty", () => {
  it("should return issue when the input is non empty", () => {
    assertEquals([...empty().check("a", { paths: [] })], [{
      message: "expected empty, actual 1 element",
      paths: [],
    }]);
  });

  it("should return issue with plural when the input is non empty", () => {
    assertEquals([...empty().check("aa", { paths: [] })], [{
      message: "expected empty, actual 2 elements",
      paths: [],
    }]);
  });

  it("should return empty list when the input is empty", () => {
    assertEquals([...empty().check([], { paths: [] })], []);
  });
});

describe("nonempty", () => {
  it("should return issue when the input is empty", () => {
    assertEquals([...nonempty().check("", { paths: [] })], [{
      message: "expected non empty, actual empty",
      paths: [],
    }]);
  });

  it("should return empty list when the input is non empty", () => {
    assertEquals([...nonempty().check([""], { paths: [] })], []);
  });
});
