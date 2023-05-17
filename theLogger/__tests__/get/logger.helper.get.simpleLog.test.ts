import {beforeEach, describe, expect, jest} from "@jest/globals";
import {loggerHelper} from "../../logger.helper";
import {baseLogger} from "../../utils/baseLogger";

let baseLoggerGet = null;
let _get: typeof loggerHelper.get = null;

describe("logger helper get simple logs", () => {
  beforeEach(async () => {
    jest.resetModules();
    baseLogger.mock.get(
      (baseLoggerGet = jest.fn(
        (name, params = {}) =>
          `${name}_${
            params["withoutAllureHandler"] ? "noAllure" : "withAllure"
          }`,
      )),
    );
    _get = (await import("../../logger.helper")).loggerHelper.get;
  });

  it("log", async () => {
    expect(_get("log").log).toEqual("log_noAllure");
  });

  it("logWithAllure", async () => {
    expect(_get("logWithAllure").logWithAllure).toEqual(
      "logWithAllure_withAllure",
    );
  });
});
