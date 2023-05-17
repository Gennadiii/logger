import {beforeEach, describe, expect, jest} from "@jest/globals";
import {commonUtils} from "../../commonUtils";
import {baseLogger} from "../../baseLogger";
import {LogLevel} from "../../../logger.types";

let baseLoggerGet = null;
let getBaseName = null;
let startStep = null;
let endStep = null;
let debug = null;
let _commonUtils: typeof commonUtils = null;
let mockInFunc = null;
let errorAsyncFunc = null;
let errorSyncFunc = null;
const params = {
  logLevel: LogLevel.debug,
  logMessage: "logMessage",
  name: "name",
};

describe("logger utils commonUtils log", () => {
  beforeEach(async () => {
    jest.resetModules();
    startStep = jest.fn();
    endStep = jest.fn();
    const allureReporter = {startStep, endStep};
    jest.mock("@wdio/allure-reporter", () => allureReporter);
    debug = jest.fn();
    baseLoggerGet = jest.fn(() => ({debug}));
    getBaseName = jest.fn(() => "baseName");
    baseLogger.mock.construct([
      {
        propName: baseLogger.get.name,
        mockValue: baseLoggerGet,
      },
      {propName: baseLogger.getBaseName.name, mockValue: getBaseName},
    ]);
    _commonUtils = (await import("../../commonUtils")).commonUtils;
  });

  it("gets correct baseLog", async () => {
    await _commonUtils.log({...params, result: 42});
    expect(getBaseName).toHaveBeenCalledWith("name");
    expect(baseLoggerGet).toHaveBeenCalledWith("name", {
      withoutAllureHandler: true,
    });
  });

  it("logs using log4js", async () => {
    await _commonUtils.log({...params, result: 42});
    expect(debug).toHaveBeenCalledWith("logMessage");
  });

  describe("allure logs and result", () => {
    it("sync", async () => {
      expect(_commonUtils.log({...params, result: 42})).toEqual(42);
      expect(startStep).toHaveBeenCalledWith("{baseName} logMessage");
      expect(endStep).toHaveBeenCalledWith("passed");
      const startStepOrder = startStep.mock.invocationCallOrder[0];
      const endStepOrder = endStep.mock.invocationCallOrder[0];
      expect(startStepOrder).toBeLessThan(endStepOrder);
    });

    it("async", async () => {
      const mockInFunc = jest.fn();
      const func = async () => {
        await Promise.resolve();
        mockInFunc();
      };
      expect(await _commonUtils.log({...params, result: func()})).toEqual(
        undefined,
      );
      expect(startStep).toHaveBeenCalledWith("{baseName} logMessage");
      expect(mockInFunc).toHaveBeenCalledTimes(1);
      expect(endStep).toHaveBeenCalledWith("passed");
      const startStepOrder = startStep.mock.invocationCallOrder[0];
      const mockInFuncOrder = mockInFunc.mock.invocationCallOrder[0];
      const endStepOrder = endStep.mock.invocationCallOrder[0];
      expect(startStepOrder).toBeLessThan(mockInFuncOrder);
      expect(mockInFuncOrder).toBeLessThan(endStepOrder);
    });
  });

  describe("error handle", () => {
    describe("async", () => {
      beforeEach(() => {
        mockInFunc = jest.fn();
        errorAsyncFunc = async () => {
          await Promise.resolve();
          mockInFunc();
          throw new Error("error");
        };
      });
      it("throws", async () => {
        await expect(
          async () =>
            await _commonUtils.log({...params, getResult: errorAsyncFunc}),
        ).rejects.toThrow("error");
      });

      it("allure log", async () => {
        await expect(
          async () =>
            await _commonUtils.log({...params, getResult: errorAsyncFunc}),
        ).rejects.toThrow("error");
        expect(startStep).toHaveBeenCalledWith("{baseName} logMessage");
        expect(mockInFunc).toHaveBeenCalledTimes(1);
        const startStepOrder = startStep.mock.invocationCallOrder[0];
        const mockInFuncOrder = mockInFunc.mock.invocationCallOrder[0];
        expect(startStepOrder).toBeLessThan(mockInFuncOrder);
      });

      it("logs using log4js", async () => {
        await expect(
          async () =>
            await _commonUtils.log({...params, getResult: errorAsyncFunc}),
        ).rejects.toThrow("error");
        expect(debug).toHaveBeenCalledWith("logMessage");
      });
    });

    describe("sync", () => {
      beforeEach(() => {
        mockInFunc = jest.fn();
        errorSyncFunc = () => {
          mockInFunc();
          throw new Error("error");
        };
      });
      it("throws", async () => {
        await expect(
          async () =>
            await _commonUtils.log({...params, getResult: errorSyncFunc}),
        ).rejects.toThrow("error");
      });

      it("allure log", async () => {
        await expect(
          async () =>
            await _commonUtils.log({...params, getResult: errorSyncFunc}),
        ).rejects.toThrow("error");
        expect(startStep).toHaveBeenCalledWith("{baseName} logMessage");
        expect(mockInFunc).toHaveBeenCalledTimes(1);
        const startStepOrder = startStep.mock.invocationCallOrder[0];
        const mockInFuncOrder = mockInFunc.mock.invocationCallOrder[0];
        expect(startStepOrder).toBeLessThan(mockInFuncOrder);
      });

      it("logs using log4js", async () => {
        await expect(
          async () =>
            await _commonUtils.log({...params, getResult: errorSyncFunc}),
        ).rejects.toThrow("error");
        expect(debug).toHaveBeenCalledWith("logMessage");
      });
    });
  });
});
