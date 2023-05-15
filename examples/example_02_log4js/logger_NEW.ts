import {configure, getLogger as getLog4jsLogger} from "log4js";

configure({
  appenders: {
    console: {
      type: "console",
      layout: {
        type: "pattern",
        pattern: "%[%p [%d{hh.mm.ss.SSS}] {%c} %m%]",
      },
    },
    file: {
      type: "file",
      filename: `../../logs/${Date.now()}_${process.pid}.log`,
      layout: {
        type: "pattern",
        pattern: "%p [%d{hh.mm.ss.SSS}] {%c} %m",
      },
    },
  },
  categories: {
    default: {appenders: ["console", "file"], level: "trace"},
  },
});

export const getLogger = getLog4jsLogger; 
