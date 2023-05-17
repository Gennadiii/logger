import {getLogger, configure, Logger} from "log4js";
import allureReporter from "@wdio/allure-reporter";
import {magicStrings} from "../../helpers/magicStrings/magicStrings.helper";
import {Mock, mockHelper, Mocks} from "../../helpers/mock/mock.helper";
import {processHelper} from "../../helpers/process/process.helper";
import {nameShortener} from "./nameShortener";

const genericLogLevel = "trace";

configure({
  appenders: {
    console: {
      type: "console",
      layout: {
        type: "pattern",
        pattern: "%[%-5.5p [%d{hh.mm.ss.SSS}] {%c} %m%]",
      },
    },
    file: {
      type: "file",
      filename: `${
        magicStrings.path.root
      }/logs/${Date.now()}_${processHelper.getPid()}.log`,
      layout: {
        type: "pattern",
        pattern: "%-5.5p [%d{hh.mm.ss.SSS}] {%c} %m",
      },
    },
  },
  categories: {
    default: {appenders: ["console", "file"], level: genericLogLevel},
  },
});

export const baseLogger = {
  get(name: string, params = {withoutAllureHandler: false}): Logger {
    const {withoutAllureHandler} = params;
    const log = getLogger(this.getBaseName(name));
    const allureStepHandler = {
      get(target, propKey) {
        const originalMethod = target[propKey];
        return message => {
          allureReporter.addStep(message);
          return originalMethod.call(log, message);
        };
      },
    };
    return withoutAllureHandler ? log : new Proxy(log, allureStepHandler);
  },

  getBaseName(name: string): string {
    let fullName = `${name}_${processHelper.getPid()}`;
    let prefix = "";
    if (fullName.includes(`Po_`)) {
      prefix = "---";
    }
    if (fullName.includes(`Service_`)) {
      prefix = "++";
    }
    if (fullName.includes(`ApiHelper_`)) {
      prefix = "^^";
    }
    Object.entries(nameShortener).forEach(([full, short]) => {
      if (fullName.includes(full)) {
        fullName = fullName.replace(full, short);
      }
    });
    return (prefix + fullName).padEnd(32);
  },

  get mock() {
    return {
      get: mockValue => getMock({propName: this.get.name, mockValue}),
      construct: (mocks: Mocks) =>
        mockHelper.buildMock({filePath: __filename, mocks}),
    };
  },
};

function getMock(mock: Mock) {
  return mockHelper.buildMock({filePath: __filename, mocks: [mock]});
}
