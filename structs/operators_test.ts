import { and, or } from "./operators.ts";
import { number, string } from "./cores.ts";
import { maxSize, minSize } from "./subsets.ts";
import { assertEquals, describe, it } from "../dev_deps.ts";

describe("and", () => {
  it("should return issue when input does not satisfy structs", () => {
    const Str5To10 = and(string()).and(maxSize(10)).and(minSize(5));

    assertEquals([...Str5To10.check("abc")], [{
      message:
        "expected greater than or equal to 5 elements, actual 3 elements",
    }]);
  });

  it("should return empty list when input satisfy all structs", () => {
    const Str5To10 = and(string()).and(maxSize(10)).and(minSize(5));

    assertEquals([...Str5To10.check("typestruct")], []);
  });

  it("should return name", () => {
    const Str5To10 = and(string()).and(maxSize(10)).and(minSize(5));

    assertEquals(Str5To10[Symbol.toStringTag], `(string & maxSize & minSize)`);
  });
});

describe("or", () => {
  it("should return issue when input does not satisfy structs", () => {
    assertEquals([...or(string()).or(number()).check({})], [{
      message: `expected (string | number), actual [object Object]`,
    }]);
  });

  it("should return issue when input does not satisfy nested structs", () => {
    const Or = or(string()).or(number());

    assertEquals([...or(Or).or(string()).check({})], [{
      message: `expected ((string | number) | string), actual [object Object]`,
    }]);
  });

  it("should return string", () => {
    const Or = or(string()).or(number());

    assertEquals(Or[Symbol.toStringTag], `(string | number)`);
  });

  it("should return empty list when input satisfy struct", () => {
    const Or = or(string()).or(number());

    assertEquals([...Or.check("")], []);
  });
});
