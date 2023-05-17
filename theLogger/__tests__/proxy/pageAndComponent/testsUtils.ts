import {LogLevel} from "../../../logger.types";

declare const expect;
declare const jest;

export const testsUtils = {
  async getPreconditions(): Promise<{log: unknown; page: unknown}> {
    jest.resetModules();
    const log = jest.fn(({getResult, result}) => result || getResult());
    jest.mock("../../../utils/commonUtils", () => ({
      commonUtils: {
        ...jest.requireActual("../../../utils/commonUtils")["commonUtils"],
        log,
      },
    }));
    const _loggerHelper = (await import("../../../logger.helper")).loggerHelper;

    @_loggerHelper.classLog
    class Component {
      public ef = null;

      constructor(private readonly prop?) {
        this.ef = () => prop;
        this.ef.funcProp = "funcProp";
      }

      locator = "locator";

      async action(...args) {
        await Promise.resolve(args);
        return "action";
      }
    }

    class PagePo {
      name = "PagePo";
      element = new Component();
      elementObj = {elementObjProp: new Component()};
      passwordInput = new Component();
      superPasswordInput = new Component();
      getElement = prop => new Component(prop);
      getElementObj = () => ({getElementObjProp: new Component()});
      syncAction = () => "syncAction";
      asyncAction = async param => {
        await this.element.action();
        return "asyncAction" + param;
      };
      someParams = {};
    }

    const page = _loggerHelper.pageLogProxy(new PagePo());
    return {page, log};
  },

  getLogArguments(params: getLogArgumentsInterface): unknown {
    const {logMessage, logLevel = LogLevel.info} = params;
    return expect.objectContaining({
      logMessage,
      logLevel,
      name: "PagePo",
    });
  },
};

interface getLogArgumentsInterface {
  logMessage: string;
  logLevel?: LogLevel;
}
