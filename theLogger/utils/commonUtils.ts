import {Mock, mockHelper} from "../../helpers/mock/mock.helper";
import {baseLogger} from "./baseLogger";
import allureReporter from "@wdio/allure-reporter";
import {LogLevel} from "../logger.types";

export const commonUtils = {
  log<T>(params: logInterface<T>): Promise<T> | T {
    // getResult is more preferable than result because
    // if error occurs in case of just result we will see no logs
    const {name, logMessage, logLevel, getResult} = params;
    let {result} = params;
    const baseName = baseLogger.getBaseName(name);
    const log4js = baseLogger.get(name, {
      withoutAllureHandler: true,
    });
    log4js[logLevel](logMessage);
    allureReporter.startStep(`{${baseName}} ${logMessage}`);
    result = result || getResult();
    if (this.isPromise(result)) {
      return (async () => {
        const awaitedResult = await result;
        allureReporter.endStep("passed");
        return awaitedResult;
      })();
    }
    allureReporter.endStep("passed");
    return result;
  },

  // can't use promiseHelper due to circular dependency
  isPromise(arg: unknown): boolean {
    return Object.prototype.toString.call(arg) === "[object Promise]";
  },

  get mock() {
    return {
      log: mockValue => getMock({propName: this.log.name, mockValue}),
    };
  },
};

function getMock(mock: Mock) {
  return mockHelper.buildMock({filePath: __filename, mocks: [mock]});
}

interface logInterface<T> {
  name: string;
  logMessage: string;
  logLevel: LogLevel;
  result?: T | Promise<T>;
  getResult?: () => T | Promise<T>;
}
