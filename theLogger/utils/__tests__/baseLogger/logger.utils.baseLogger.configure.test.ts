import {beforeEach, describe, expect, jest} from "@jest/globals";
import {mockHelper} from "../../../../helpers/mock/mock.helper";

const originalEnv = process.env;
let configure = null;

describe("logger utils baseLogger configure", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {...originalEnv};
    configure = jest.fn();
    mockHelper.buildNodeModulesMock({
      moduleName: "log4js",
      mocks: [{propName: "configure", mockValue: configure}],
    });
  });

  it("calls configure ones", async () => {
    await import("../../baseLogger");
    await import("../../baseLogger");
    expect(configure).toHaveBeenCalledTimes(1);
  });
});
