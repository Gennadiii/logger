import {configure, getLogger, Logger} from "log4js";
import allureReporter from "@wdio/allure-reporter";

const logDir = `${process.cwd()}/logs`;

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
      filename: `${logDir}/${Date.now()}_${process.pid}.log`,
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
    return getLogger(getBaseName(name));
  },
};

const nameShortener = {
  SomeVeryLongNameForLoginService: "Login",
  Service: "",
  Po_: "_",
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
  Object.entries(nameShortener).forEach(([full, short]) => {
    if (fullName.includes(full)) {
      fullName = fullName.replace(full, short);
    }
  });
  return (prefix + fullName).padEnd(20);
}

export function serviceProxyDecorator<T extends object>(obj: T): T {
  return new Proxy(obj, {
    get(_class, method) {
      const original = _class[method];
      if (typeof original !== "function") {
        return original;
      }
      return (...args) => {
        const getResult = () => original.apply(_class, args);
        const logMessage = `${method.toString()} [${JSON.stringify(args)}]`;
        return log({
          logMessage,
          getResult,
          name: _class.constructor.name,
        });
      };
    },
  });
}

function log<T>(params: logInterface<T>): Promise<T> | T {
  const {name, logMessage, getResult} = params;
  const baseName = getBaseName(name);
  const log4js = logger.get(name);
  log4js.info(logMessage);
  allureReporter.startStep(`{${baseName}} ${logMessage}`);
  const result = getResult();
  if (isPromise(result)) {
    return (async () => {
      const awaitedResult = await result;
      allureReporter.endStep("passed");
      return awaitedResult;
    })();
  }
  allureReporter.endStep("passed");
  return result;
}

function isPromise(arg: unknown): boolean {
  return Object.prototype.toString.call(arg) === "[object Promise]";
}

interface logInterface<T> {
  name: string;
  logMessage: string;
  getResult?: () => T | Promise<T>;
}

const pageProps = {};

export function pageLogProxyDecorator<T extends object>(obj: T): T {
  return new Proxy(obj, {
    get(pageObject, componentOrMethod) {
      const original = pageObject[componentOrMethod];
      // diff
      if (typeof original === "function") {
        return (...args) => {
          const result = original.apply(pageObject, args);
          if (isComponent(result)) {
            return pageMethodReturningComponentHandler({
              result,
              pageObject,
              componentOrMethod,
              args,
            });
          }
        };
      }
      if (isObject(original)) {
        isComponent(original)
          ? componentHandler({
              page: pageObject,
              prop: componentOrMethod.toString(),
            })
          : componentsObjectHandler({page: pageObject, obj: original});
      }
      return original;
    },
  });
}

function pageMethodReturningComponentHandler<T>(
  params: extendedPageHandlerInterface<T>,
): Promise<T> | T {
  const {pageObject, result, componentOrMethod, args} = params;
  pageProps[result["locator"]] = {
    page: pageObject,
    element: `${componentOrMethod.toString()}(${JSON.stringify(args)})`,
  };
  return result;
}

function componentsObjectHandler<T>(
  params: componentsObjectHandlerInterface<T>,
): void {
  const {page, obj} = params;
  const originalObjectEntries = Object.entries(obj);
  isComponent(
    // might be empty
    originalObjectEntries[0] &&
      (originalObjectEntries[0][1] as Record<string, unknown>),
  ) && elementsObjectHandler({page, obj});
}

function elementsObjectHandler<T>(
  params: componentsObjectHandlerInterface<T>,
): void {
  const {obj, page} = params;
  Object.entries(obj).forEach(([elementName, component]) => {
    if (component?.["locator"]) {
      pageProps[component["locator"]] = {
        page,
        element: elementName,
      };
    }
  });
}

function isComponent(obj: Record<string, unknown>): boolean {
  return Boolean(obj?.locator);
}

function isObject(param: unknown): boolean {
  return param && typeof param === "object";
}

function componentHandler<T>(params: componentHandlerInterface<T>): void {
  const {page, prop} = params;
  pageProps[page[prop].locator] = {page, element: prop};
}

interface componentHandlerInterface<T> {
  prop: string;
  page: T;
}

export function componentLogProxyDecorator<T extends object>(obj: T): T {
  return new Proxy(obj, {
    get(component, method) {
      const original = component[method];
      if (typeof original !== "function") {
        return original;
      }
      return (...args) => {
        const getResult = () => original.apply(component, args);
        // call to methods like isOpen checks for elements displayed
        // which has not yet been added to pageProps
        const {page, element} = pageProps[component["locator"]] || {};
        if (!page) {
          return getResult();
        }
        const pageTargetName = page?.constructor?.name;
        const logMessage = `[${element}] ${original.name} [${JSON.stringify(
          args,
        )}]`;
        return log({
          logMessage,
          getResult,
          name: pageTargetName,
        });
      };
    },
  });
}

export function classLogDecorator<T>(Target: T): T {
  // eslint-disable-next-line
  // @ts-ignore
  return function (...args): T {
    return componentLogProxyDecorator(
      // eslint-disable-next-line
      // @ts-ignore
      new Target(...args),
    );
  };
}

interface componentsObjectHandlerInterface<T> {
  page: unknown;
  obj: Promise<T> | T;
}

interface basePageHandler<T> {
  result: Promise<T> | T;
  pageObject: unknown;
}

interface extendedPageHandlerInterface<T> extends basePageHandler<T> {
  componentOrMethod: unknown;
  args: unknown[];
}
