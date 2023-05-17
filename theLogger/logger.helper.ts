import {Logger} from "log4js";
import "webdriverio";
import {baseLogger} from "./utils/baseLogger";
import {
  logConfigInterface,
  serviceAndApiLogProxy,
} from "./utils/serviceAndApi/serviceAndApiLogProxy";
import {pageAndComponentLogProxy} from "./utils/pageAndComponent/pageAndComponentLogProxy";
import {LogLevel} from "./logger.types";
/*
Needed for proxy logs. The call looks like pageObject.element.method();
In order to build the full log both dots get some data and the "element" is the connection.
We need page name and element name from the first dot to use those names when the method is called.
For that matter we need to store those names in the object below.
We take locator from the element as object key and names as value.
Then when method on the element is called we take the element locator from the second dot
and use it to access page and element names.
*/

export const loggerHelper = {
  // eslint-disable-next-line
  get(name?: string) {
    const log: Logger = baseLogger.get(name, {withoutAllureHandler: true});
    const logWithAllure: Logger = baseLogger.get(name);
    return {
      configureLog(params: logConfigInterface) {
        return function (target, prop, descriptor) {
          return serviceAndApiLogProxy.configureLog({
            descriptor,
            configuration: params,
          });
        };
      },
      log,
      logWithAllure,
    };
  },

  apiLogProxy<T extends object>(obj: T): T {
    return serviceAndApiLogProxy.get(obj, LogLevel.trace);
  },

  serviceLogProxy<T extends object>(obj: T): T {
    return serviceAndApiLogProxy.get(obj, LogLevel.info);
  },

  pageLogProxy<T extends object>(obj: T): T {
    return pageAndComponentLogProxy.pageLogProxy(obj);
  },

  classLog<T>(Target: T): T {
    // eslint-disable-next-line
    // @ts-ignore
    return function (...args): T {
      return pageAndComponentLogProxy.componentLogProxy(
        // eslint-disable-next-line
        // @ts-ignore
        new Target(...args),
      );
    };
  },
};
