import {beforeEach, describe, expect, jest} from "@jest/globals";
import {testsUtils} from "./testsUtils";
import {LogLevel} from "../../../logger.types";

let log = null;
let page = null;

describe("logger helper proxy pageAndComponent", () => {
  beforeEach(async () => {
    jest.resetModules();
    const data = await testsUtils.getPreconditions();
    log = data.log;
    page = data.page;
  });

  it("handles additional props of a method", () => {
    expect(page.element.ef.funcProp).toEqual("funcProp");
  });

  it("logs async action", async () => {
    expect(await page.asyncAction(42)).toEqual("asyncAction42");
    expect(log).toHaveBeenCalledWith(
      testsUtils.getLogArguments({
        logMessage: "asyncAction [[42]]",
        logLevel: LogLevel.debug,
      }),
    );
  });

  describe("doesn't log", () => {
    it("sync action", () => {
      expect(page.syncAction()).toEqual("syncAction");
      expect(log).toHaveBeenCalledTimes(0);
    });

    it("components actions in async method", async () => {
      await page.asyncAction(42);
      // logs just an action
      expect(log).toHaveBeenCalledTimes(1);
    });

    it("page properties", () => {
      expect(page.name).toEqual("PagePo");
      expect(page.someParams).toEqual({});
      expect(log).toHaveBeenCalledTimes(0);
    });

    it("toString method", async () => {
      expect(page.element.toString()).toEqual("[object Object]");
      expect(log).toHaveBeenCalledTimes(0);
    });
  });

  describe("logs single element", () => {
    it("no arguments", async () => {
      expect(await page.element.action()).toEqual("action");
      expect(log).toHaveBeenCalledWith(
        testsUtils.getLogArguments({logMessage: "[element] action [[]]"}),
      );
    });

    it("with arguments", async () => {
      expect(await page.element.action(42, {key: "prop"})).toEqual("action");
      expect(log).toHaveBeenCalledWith(
        testsUtils.getLogArguments({
          logMessage: '[element] action [[42,{"key":"prop"}]]',
        }),
      );
    });
  });

  it("logs method returning element", async () => {
    expect(await page.getElement({key: 18}).action(42, {key: "prop"})).toEqual(
      "action",
    );
    expect(log).toHaveBeenCalledWith(
      testsUtils.getLogArguments({
        logMessage: '[getElement([{"key":18}])] action [[42,{"key":"prop"}]]',
      }),
    );
  });

  it("logs method returning elements object", async () => {
    expect(
      await page.getElementObj().getElementObjProp.action(42, {key: "prop"}),
    ).toEqual("action");
    expect(log).toHaveBeenCalledWith(
      testsUtils.getLogArguments({
        logMessage: '[getElementObjProp] action [[42,{"key":"prop"}]]',
      }),
    );
  });

  it("logs elements object", async () => {
    expect(
      await page.elementObj.elementObjProp.action(42, {key: "prop"}),
    ).toEqual("action");
    expect(log).toHaveBeenCalledWith(
      testsUtils.getLogArguments({
        logMessage: '[elementObjProp] action [[42,{"key":"prop"}]]',
      }),
    );
  });
});
