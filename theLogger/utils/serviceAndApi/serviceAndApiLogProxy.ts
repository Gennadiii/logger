import { Mock, mockHelper } from "../../../helpers/mock/mock.helper";
import {commonUtils} from "../commonUtils";
import {genericArgsToLogInterface, utils} from "./utils";
import {LogLevel} from "../../logger.types";

const logConfig = Symbol();

export const serviceAndApiLogProxy = {
  get<T extends object>(obj: T, loggingLevel: LogLevel): T {
    return new Proxy(obj, {
      get(_class, method) {
        const original = _class[method];
        if (typeof original !== "function") {
          return original;
        }
        const {
          shouldLogArgs = true,
          shouldLog = true,
          logLevel = loggingLevel,
          logArgsLambda,
        } = original[logConfig] || {};
        const proxyFunc = (...args) => {
          const getResult = () => original.apply(_class, args);
          if (!shouldLog) {
            return getResult();
          }
          const logArgs = utils.getArgsToLog({
            args,
            shouldLogArgs,
            logArgsLambda,
          });
          const logMessage = `${method.toString()} [${logArgs}]`;
          return commonUtils.log({
            logMessage,
            logLevel,
            getResult,
            name: _class.constructor.name,
          });
        };
        Object.defineProperty(proxyFunc, "name", {
          value: _class.constructor.name,
          writable: false,
        });
        return proxyFunc;
      },
    });
  },

  configureLog(params: configureLogInterface): PropertyDescriptor {
    const {descriptor, configuration} = params;
    descriptor.value[logConfig] = configuration;
    return descriptor;
  },

  get mock() {
    return {
      get: mockValue => getMock({propName: this.get.name, mockValue}),
    };
  },
};

function getMock(mock: Mock) {
  return mockHelper.buildMock({filePath: __filename, mocks: [mock]});
}

export interface logConfigInterface extends genericArgsToLogInterface {
  shouldLog?: boolean;
  logLevel?: LogLevel;
}

interface configureLogInterface {
  descriptor: PropertyDescriptor;
  configuration: logConfigInterface;
}
