import {commonUtils} from "../commonUtils";
import {LogLevel} from "../../logger.types";

export const utils = {
  pageProps: {},

  isPasswordInput(elementName: string): boolean {
    return elementName.toLowerCase().includes("passwordinput");
  },

  pageActionHandler<T>(
    params: extendedPageHandlerInterface<T>,
  ): Promise<T> | T {
    const {componentOrMethod, result, pageObject, args} = params;
    const logMessage = `${componentOrMethod.toString()} [${JSON.stringify(
      args,
    )}]`;
    return commonUtils.log({
      logMessage,
      result,
      logLevel: LogLevel.debug,
      name: pageObject["name"],
    });
  },

  pageMethodReturningComponentHandler<T>(
    params: extendedPageHandlerInterface<T>,
  ): Promise<T> | T {
    const {pageObject, result, componentOrMethod, args} = params;
    this.pageProps[result["locator"]] = {
      page: pageObject,
      element: `${componentOrMethod.toString()}(${JSON.stringify(args)})`,
    };
    return result;
  },

  pageMethodReturningComponentsObjectHandler<T>(
    params: basePageHandler<T>,
  ): Promise<T> | T {
    const {pageObject, result} = params;
    typeof result === "object" &&
      this._elementsObjectHandler({obj: result, page: pageObject});
    return result;
  },

  componentHandler<T>(params: componentHandlerInterface<T>): void {
    const {page, prop} = params;
    utils.pageProps[page[prop].locator] = {page, element: prop};
  },

  componentsObjectHandler<T>(params: componentsObjectHandlerInterface<T>): void {
    const {page, obj} = params;
    const originalObjectEntries = Object.entries(obj);
    utils.isComponent(
      // might be empty
      originalObjectEntries[0] &&
        (originalObjectEntries[0][1] as Record<string, unknown>),
    ) && utils._elementsObjectHandler({page, obj});
  },

  isComponent(obj: Record<string, unknown>): boolean {
    return Boolean(obj?.locator);
  },

  isObject(param: unknown): boolean {
    return param && typeof param === "object";
  },

  _elementsObjectHandler<T>(params: componentsObjectHandlerInterface<T>): void {
    const {obj, page} = params;
    Object.entries(obj).forEach(([elementName, component]) => {
      if (component && component["locator"]) {
        this.pageProps[component["locator"]] = {
          page,
          element: elementName,
        };
      }
    });
  },
};

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

interface componentHandlerInterface<T> {
  prop: string;
  page: T;
}
