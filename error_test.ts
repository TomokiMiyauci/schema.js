import { StructError } from "./error.ts";
import { assertEquals, describe, it } from "./dev_deps.ts";

describe("StructError", () => {
  it("should return struct error", () => {
    const er = new StructError([]);

    assertEquals(er.issues, []);
    assertEquals(er.message, ``);
    assertEquals(er.name, `StructError`);
  });

  it("should return head message when issues is empty list", () => {
    const er = new StructError([], "invalid");

    assertEquals(er.message, `invalid`);
  });

  it("should return body message when issues are exist", () => {
    const er = new StructError([{ message: "invalid1", paths: [] }, {
      message: "invalid2",
      paths: [""],
    }]);

    assertEquals(
      er.message,
      `
    invalid1
    $. - invalid2`,
    );
  });

  it("should return head and body message", () => {
    const er = new StructError([{
      message: "Invalid",
      paths: ["a", "b", "c"],
    }, {
      message: "Invalid2",
      paths: ["b", "c", "d"],
    }], "2 issues");

    assertEquals(
      er.message,
      `2 issues
    $.a.b.c - Invalid
    $.b.c.d - Invalid2`,
    );
  });
});
