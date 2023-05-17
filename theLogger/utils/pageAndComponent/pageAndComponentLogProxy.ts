import {commonUtils} from "../commonUtils";
import _ from "lodash";
import {utils} from "./utils";
import {LogLevel} from "../../logger.types";

export const pageAndComponentLogProxy = {
  pageLogProxy<T extends object>(obj: T): T {
    return new Proxy(obj, {
      get(pageObject, componentOrMethod) {
        const original = pageObject[componentOrMethod];
        if (typeof original === "function") {
          return (...args) => {
            const result = original.apply(pageObject, args);
            if (commonUtils.isPromise(result)) {
              return utils.pageActionHandler({
                componentOrMethod,
                result,
                pageObject,
                args,
              });
            }
            if (utils.isComponent(result)) {
              return utils.pageMethodReturningComponentHandler({
                result,
                pageObject,
                componentOrMethod,
                args,
              });
            }
            return utils.pageMethodReturningComponentsObjectHandler({
              result,
              pageObject,
            });
          };
        }
        if (utils.isObject(original)) {
          // component check is needed for properties like isOpenParams etc.
          utils.isComponent(original)
            ? utils.componentHandler({
                page: pageObject,
                prop: componentOrMethod.toString(),
              })
            : utils.componentsObjectHandler({page: pageObject, obj: original});
        }
        return original;
      },
    });
  },

  componentLogProxy<T extends object>(obj: T): T {
    return new Proxy(obj, {
      get(component, method) {
        const original = component[method];
        if (method === "toString") {
          return original;
        }
        if (typeof original !== "function") {
          return original;
        }
        const defaultProps = [
          "length",
          "name",
          "arguments",
          "caller",
          "prototype",
        ];
        const funcProps = Object.getOwnPropertyNames(original);
        const customFuncProps = _.difference(funcProps, defaultProps);
        const proxyFunc = (...args) => {
          const getResult = () => original.apply(component, args);
          // call to methods like isOpen checks for elements displayed
          // which has not yet been added to pageProps
          const {page, element} = utils.pageProps[component["locator"]] || {};
          if (!page) {
            return getResult();
          }
          const pageTargetName = page.name;
          const argsToLog = utils.isPasswordInput(element) ? ['***'] : args;
          const logMessage = `[${element}] ${original.name} [${JSON.stringify(
            argsToLog,
          )}]`;
          return commonUtils.log({
            logMessage,
            getResult,
            name: pageTargetName,
            logLevel: LogLevel.info,
          });
        };
        customFuncProps.forEach(
          property => (proxyFunc[property] = original[property]),
        );
        return proxyFunc;
      },
    });
  },
};
