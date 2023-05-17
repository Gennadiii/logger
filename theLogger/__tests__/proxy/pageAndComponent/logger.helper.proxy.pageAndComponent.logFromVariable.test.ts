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

  describe("logs element written to a variable", () => {
    describe("logs single element", () => {
      it("no arguments", async () => {
        const elementVar = page.element;
        expect(await elementVar.action()).toEqual("action");
        expect(log).toHaveBeenCalledWith(
          testsUtils.getLogArguments({logMessage: "[element] action [[]]"}),
        );
      });

      it("with arguments", async () => {
        const elementVar = page.element;
        expect(await elementVar.action(42, {key: "prop"})).toEqual("action");
        expect(log).toHaveBeenCalledWith(
          testsUtils.getLogArguments({
            logMessage: '[element] action [[42,{"key":"prop"}]]',
          }),
        );
      });
    });

    it("logs method returning element", async () => {
      const elementVar = page.getElement({key: 18});
      expect(await elementVar.action(42, {key: "prop"})).toEqual("action");
      expect(log).toHaveBeenCalledWith(
        testsUtils.getLogArguments({
          logMessage: '[getElement([{"key":18}])] action [[42,{"key":"prop"}]]',
        }),
      );
    });

    it("logs method returning elements object", async () => {
      const elementVar = page.getElementObj().getElementObjProp;
      expect(await elementVar.action(42, {key: "prop"})).toEqual("action");
      expect(log).toHaveBeenCalledWith(
        testsUtils.getLogArguments({
          logMessage: '[getElementObjProp] action [[42,{"key":"prop"}]]',
        }),
      );
    });

    it("logs elements object", async () => {
      const elementVar = page.elementObj.elementObjProp;
      expect(await elementVar.action(42, {key: "prop"})).toEqual("action");
      expect(log).toHaveBeenCalledWith(
        testsUtils.getLogArguments({
          logMessage: '[elementObjProp] action [[42,{"key":"prop"}]]',
        }),
      );
    });
  });
});
