import {describe, expect, it} from "@jest/globals";
import {commonUtils} from "../../commonUtils";

describe("logger utils commonUtils isPromise", () => {
  it("returns true if argument is a promise", async function () {
    expect(commonUtils.isPromise(Promise.resolve())).toBe(true);
  });

  it("returns false if argument is not a promise", async function () {
    expect(commonUtils.isPromise(await Promise.resolve())).toBe(false);
    expect(commonUtils.isPromise(42)).toBe(false);
    expect(commonUtils.isPromise(() => Promise.resolve())).toBe(false);
  });
});
