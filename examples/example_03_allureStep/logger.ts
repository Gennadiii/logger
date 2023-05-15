import {configure, getLogger, Logger} from "log4js";
import allureReporter from "@wdio/allure-reporter";

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
      filename: `../../logs/${Date.now()}_${process.pid}.log`,
      layout: {
        type: "pattern",
        pattern: "%-5.5p [%d{hh.mm.ss.SSS}] {%c} %m",
      },
    },
  },
  categories: {
    default: {appenders: ["console", "file"], level: "trace"},
  },
});

export const logger = {
  get(name: string): Logger {
    const log = getLogger(getBaseName(name));
    const allureStepHandler = {
      get(log, level) {
        const originalMethod = log[level];
        return message => {
          allureReporter.addStep(message);
          return originalMethod.call(log, message);
        };
      },
    };
    return new Proxy(log, allureStepHandler);
  },
};

function getBaseName(name: string): string {
  let fullName = `${name}_${process.pid}`;
  let prefix = "";
  if (fullName.includes(`Po_`)) {
    prefix = "---";
  }
  if (fullName.includes(`Service_`)) {
    prefix = "++";
  }
  return (prefix + fullName).padEnd(20);
}
