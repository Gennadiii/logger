import {beforeEach, describe, expect} from "@jest/globals";
import {testsUtils} from "./testsUtils";

let log = null;
let page = null;

describe("logger helper proxy pageAndComponent", () => {
  beforeEach(async () => {
    const data = await testsUtils.getPreconditions();
    log = data.log;
    page = data.page;
  });

  describe("removes password by element name pattern", () => {
    it("passwordInput", async () => {
      expect(await page.passwordInput.action(42, {key: "prop"})).toEqual(
        "action",
      );
      expect(log).toHaveBeenCalledWith(
        testsUtils.getLogArguments({
          logMessage: `[passwordInput] action [["***"]]`,
        }),
      );
    });

    it(".*passwordInput", async () => {
      expect(await page.superPasswordInput.action(42, {key: "prop"})).toEqual(
        "action",
      );
      expect(log).toHaveBeenCalledWith(
        testsUtils.getLogArguments({
          logMessage: `[superPasswordInput] action [["***"]]`,
        }),
      );
    });
  });
});
