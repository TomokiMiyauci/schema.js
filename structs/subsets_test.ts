import {
  empty,
  int,
  list,
  maximum,
  maxSize,
  minimum,
  minSize,
  nan,
  negative,
  nonempty,
  nonnegative,
  nonpositive,
  pattern,
  positive,
  size,
  tuple,
  validDate,
} from "./subsets.ts";
import { assertEquals, describe, it } from "../dev_deps.ts";
import { number, object, string } from "./cores.ts";

const MESSAGE = "custom message";

describe("maximum", () => {
  it("should return issue when the input exceed max", () => {
    assertEquals([...maximum(5).check(6)], [{
      message: "expected less than or equal to 5, actual 6",
    }]);
  });

  it("should return empty list when the input less than or equal to", () => {
    assertEquals([...maximum(5).check(5)], []);
  });

  it("message override", () => {
    assertEquals([...maximum(5, MESSAGE).check(6)], [{ message: MESSAGE }]);
    assertEquals([...maximum(5, () => MESSAGE).check(6)], [{
      message: MESSAGE,
    }]);
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

  it("message override", () => {
    assertEquals([...minimum(5, MESSAGE).check(4)], [{ message: MESSAGE }]);
    assertEquals([...minimum(5, () => MESSAGE).check(4)], [{
      message: MESSAGE,
    }]);
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

  it("message override", () => {
    assertEquals([...maxSize(5, MESSAGE).check("a".repeat(6))], [{
      message: MESSAGE,
    }]);
    assertEquals([...maxSize(5, () => MESSAGE).check("a".repeat(6))], [{
      message: MESSAGE,
    }]);
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

  it("message override", () => {
    assertEquals([...minSize(5, MESSAGE).check("a".repeat(4))], [{
      message: MESSAGE,
    }]);
    assertEquals([...minSize(5, () => MESSAGE).check("a".repeat(4))], [{
      message: MESSAGE,
    }]);
  });
});

describe("size", () => {
  it("should return issue when the input element size does not equal to definition", () => {
    assertEquals([...size(1).check("")], [{
      message: "expected 1 element, actual 0 element",
    }]);
  });

  it("message override", () => {
    assertEquals([...size(1, MESSAGE).check("")], [{ message: MESSAGE }]);
    assertEquals([...size(1, () => MESSAGE).check("")], [{ message: MESSAGE }]);
  });

  it("should return empty list when the input element size equal to definition", () => {
    assertEquals([...size(2).check([1, 2])], []);
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

  it("message override", () => {
    assertEquals([...empty(MESSAGE).check("aa")], [{ message: MESSAGE }]);
  });
});

describe("nonempty", () => {
  it("should return issue when the input is empty", () => {
    assertEquals([...nonempty().check("")], [{
      message: "expected non-empty, actual 0 element",
    }]);
  });

  it("message override", () => {
    assertEquals([...nonempty(MESSAGE).check("")], [{ message: MESSAGE }]);
    assertEquals([...nonempty(() => MESSAGE).check("")], [{
      message: MESSAGE,
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

  it("message override", () => {
    assertEquals([...pattern(/^t/, MESSAGE).check("not match")], [{
      message: MESSAGE,
    }]);
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
      { message: "expected string, actual undefined", paths: ["2", "a"] },
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
      { message: "expected string, actual undefined", paths: ["0", "a"] },
    ]);
  });

  it("message override", () => {
    assertEquals(
      [...tuple([object({ a: string() })], MESSAGE).check([{}, ""])],
      [
        { message: "expected string, actual undefined", paths: ["0", "a"] },
        { message: MESSAGE, paths: ["1"] },
      ],
    );
  });

  it("should return empty list when the input satisfy children struct", () => {
    assertEquals([
      ...tuple([string(), number(), object()]).check(["", 0, {}]),
    ], []);
  });
});

describe("int", () => {
  it("should return issue when the input is not integer", () => {
    assertEquals([...int().check(1.1)], [{
      message: "expected integer, actual 1.1",
    }]);
  });

  it("message override", () => {
    assertEquals([...int(MESSAGE).check(1.1)], [{ message: MESSAGE }]);
  });

  it("should return empty list when the input is integer", () => {
    assertEquals([...int().check(1.0)], []);
  });
});

describe("positive", () => {
  it("should return issue when the input is not positive number", () => {
    assertEquals([...positive().check(0)], [{
      message: "expected positive number, actual 0",
    }]);
  });

  it("message override", () => {
    assertEquals([...positive(MESSAGE).check(0)], [{ message: MESSAGE }]);
  });

  it("should return empty list when the input is positive number", () => {
    assertEquals([...positive().check(0.1)], []);
  });
});

describe("nonpositive", () => {
  it("should return issue when the input is not non-positive number", () => {
    assertEquals([...nonpositive().check(0.1)], [{
      message: "expected non-positive number, actual 0.1",
    }]);
  });

  it("message override", () => {
    assertEquals([...nonpositive(MESSAGE).check(0.1)], [{ message: MESSAGE }]);
  });

  it("should return empty list when the input is non-positive number", () => {
    assertEquals([...nonpositive().check(0)], []);
  });
});

describe("negative", () => {
  it("should return issue when the input is not negative number", () => {
    assertEquals([...negative().check(0)], [{
      message: "expected negative number, actual 0",
    }]);
  });

  it("message override", () => {
    assertEquals([...negative(MESSAGE).check(0)], [{ message: MESSAGE }]);
  });

  it("should return empty list when the input is negative number", () => {
    assertEquals([...negative().check(-0.1)], []);
  });
});

describe("nonnegative", () => {
  it("should return issue when the input is not non-negative number", () => {
    assertEquals([...nonnegative().check(-1)], [{
      message: "expected non-negative number, actual -1",
    }]);
  });

  it("message override", () => {
    assertEquals([...nonnegative(MESSAGE).check(-1)], [{ message: MESSAGE }]);
  });

  it("should return empty list when the input is non-negative number", () => {
    assertEquals([...nonnegative().check(0)], []);
  });
});

describe("nan", () => {
  it("should return issue when the input is not NaN", () => {
    assertEquals([...nan().check(0)], [{
      message: "expected NaN, actual 0",
    }]);
  });

  it("message override", () => {
    assertEquals([...nan(MESSAGE).check(0)], [{ message: MESSAGE }]);
  });

  it("should return empty list when the input is NaN", () => {
    assertEquals([...nan().check(NaN)], []);
  });
});

describe("validDate", () => {
  it("should return issue when the input is not valid date", () => {
    assertEquals([...validDate().check(new Date("invalid"))], [{
      message: "expected valid date, actual invalid date",
    }]);
  });

  it("message override", () => {
    assertEquals([...validDate(MESSAGE).check(new Date("invalid"))], [{
      message: MESSAGE,
    }]);
  });

  it("should return empty list when the input is valid date", () => {
    assertEquals([...validDate().check(new Date("2022-01-01"))], []);
  });
});
