import { isEmailFormat } from "./type_guards.ts";
import { describe, expect, it } from "./dev_deps.ts";

describe("isEmailFormat", () => {
  it("should be false when the format is invalid", () => {
    expect(isEmailFormat("")).toBeFalsy();
    expect(isEmailFormat("    ")).toBeFalsy();
    expect(isEmailFormat("@test.test")).toBeFalsy();
    expect(isEmailFormat("test")).toBeFalsy();
    expect(isEmailFormat("test@")).toBeFalsy();
    expect(isEmailFormat("test@t")).toBeFalsy();
    expect(isEmailFormat("test@t.t")).toBeFalsy();
    expect(isEmailFormat("test@.test")).toBeFalsy();
    expect(isEmailFormat("test@test.t")).toBeFalsy();
    expect(isEmailFormat("test@test.test ")).toBeFalsy();
    expect(isEmailFormat(" test@test.test")).toBeFalsy();
    expect(isEmailFormat("test@ test.test")).toBeFalsy();
  });

  it("should be false when the format is valid", () => {
    expect(isEmailFormat("test@test.test")).toBeTruthy();
    expect(isEmailFormat("あ亜@test.test")).toBeTruthy();
  });
});
