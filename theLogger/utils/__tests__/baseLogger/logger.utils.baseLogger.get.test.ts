import {beforeEach, describe, expect, jest} from "@jest/globals";
import {mockHelper} from "../../../../helpers/mock/mock.helper";
import {processHelper} from "../../../../helpers/process/process.helper";

let getLogger = null;
let info = null;

describe("logger utils baseLogger get", () => {
  beforeEach(() => {
    jest.resetModules();
    info = jest.fn();
    getLogger = jest.fn(() => ({info}));
    mockHelper.buildNodeModulesMock({
      moduleName: "log4js",
      mocks: [
        {propName: "configure", mockValue: jest.fn()},
        {propName: "getLogger", mockValue: getLogger},
      ],
    });
    processHelper.mock.getPid(() => "pid");
  });

  it("without allure handler", async () => {
    (await import("../../baseLogger")).baseLogger
      .get("name", {withoutAllureHandler: true})
      .info("message");
    expect(getLogger).toHaveBeenCalledWith("name_pid".padEnd(32));
    expect(info).toHaveBeenCalledWith("message");
  });

  it("with allure handler", async () => {
    const addStep = jest.fn();
    const allureReporter = {addStep};
    jest.mock("@wdio/allure-reporter", () => allureReporter);
    (await import("../../baseLogger")).baseLogger.get("name").info("message");
    expect(getLogger).toHaveBeenCalledWith("name_pid".padEnd(32));
    expect(info).toHaveBeenCalledWith("message");
    expect(addStep).toHaveBeenCalledWith("message");
  });
});
