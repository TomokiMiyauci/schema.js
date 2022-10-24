import {
  empty,
  maximum,
  maxSize,
  minimum,
  minSize,
  nonempty,
} from "./subsets.ts";
import { assertEquals, describe, it } from "./dev_deps.ts";

describe("maximum", () => {
  it("should return issue when the input exceed max", () => {
    assertEquals([...maximum(5).check(6, { paths: [] })], [{
      message: "expected less than or equal to 5, actual 6",
      paths: [],
    }]);
  });

  it("should return empty list when the input less than or equal to", () => {
    assertEquals([...maximum(5).check(5, { paths: [] })], []);
  });
});

describe("minimum", () => {
  it("should return issue when the input exceed min", () => {
    assertEquals([...minimum(5).check(4, { paths: [] })], [{
      message: "expected greater than or equal to 5, actual 4",
      paths: [],
    }]);
  });

  it("should return empty list when the input greater than or equal to", () => {
    assertEquals([...minimum(5).check(5, { paths: [] })], []);
  });
});

describe("maxSize", () => {
  it("should return issue when the input element exceed max size", () => {
    assertEquals([...maxSize(5).check("a".repeat(6), { paths: [] })], [{
      message: "expected less than or equal to 5 elements, actual 6 elements",
      paths: [],
    }]);
  });

  it("should return empty list when the input element less than or equal to size", () => {
    assertEquals([...maxSize(5).check("a".repeat(5), { paths: [] })], []);
  });
});

describe("minSize", () => {
  it("should return issue when the input element less than min size", () => {
    assertEquals([...minSize(5).check("a".repeat(4), { paths: [] })], [{
      message:
        "expected greater than or equal to 5 elements, actual 4 elements",
      paths: [],
    }]);
  });

  it("should return empty list when the input element greater than or equal to size", () => {
    assertEquals([...minSize(5).check("a".repeat(5), { paths: [] })], []);
  });
});

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
