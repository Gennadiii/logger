import {beforeEach, describe, expect, jest} from "@jest/globals";
import {loggerHelper} from "../../logger.helper";
import {commonUtils} from "../../utils/commonUtils";
import {LogLevel} from "../../logger.types";

let log = null;
let _loggerHelper: typeof loggerHelper = null;
const user = {login: "user", password: "1234"};

describe("logger helper get logger configurator", () => {
  beforeEach(async () => {
    jest.resetModules();
    commonUtils.mock.log((log = jest.fn()));
    _loggerHelper = (await import("../../logger.helper")).loggerHelper;
  });

  it("doesn't look for properties config", async () => {
    class Class {
      prop: 42;
    }

    const classInstance = _loggerHelper.serviceLogProxy(new Class());
    classInstance.prop;
    expect(log).toHaveBeenCalledTimes(0);
  });

  it("shouldLogArgs", async () => {
    const {configureLog} = _loggerHelper.get();

    class Class {
      @configureLog({shouldLogArgs: false})
      method(arg) {
        return arg;
      }
    }

    const classInstance = _loggerHelper.serviceLogProxy(new Class());
    classInstance.method(42);
    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(
      expect.objectContaining({logMessage: "method [args skipped]"}),
    );
  });

  it("logLevel", async () => {
    const {configureLog} = _loggerHelper.get();

    class Class {
      @configureLog({logLevel: LogLevel.fatal})
      method(arg) {
        return arg;
      }
    }

    const classInstance = _loggerHelper.serviceLogProxy(new Class());
    classInstance.method(user);
    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(
      expect.objectContaining({
        logMessage: `method [[{"login":"user","password":"***"}]]`,
        logLevel: "fatal",
      }),
    );
  });

  it("logArguments with list of users", async () => {
    class Class {
      method(arg) {
        return arg;
      }
    }

    const classInstance = _loggerHelper.serviceLogProxy(new Class());
    classInstance.method([
      {login: "user1", password: "1234"},
      {login: "user2", password: "1234"},
      {innerObject: {login: "innerUser", password: "1234"}},
    ]);
    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(
      expect.objectContaining({
        logMessage: `method [[[{"login":"user1","password":"***"},{"login":"user2","password":"***"},{"innerObject":{"login":"innerUser","password":"***"}}]]]`,
        logLevel: "info",
      }),
    );
  });

  it("shouldLog", async () => {
    const {configureLog} = _loggerHelper.get();

    class Class {
      @configureLog({shouldLog: false})
      method(arg) {
        return arg;
      }
    }

    const classInstance = _loggerHelper.serviceLogProxy(new Class());
    classInstance.method(user);
    expect(log).toHaveBeenCalledTimes(0);
  });

  describe("propsToLog", () => {
    it("logs nothing if prop not found", async () => {
      const {configureLog} = _loggerHelper.get();

      class Class {
        @configureLog({
          logArgsLambda: args => ({
            notExistingKey: args[0]?.notExistingKey?.name,
          }),
        })
        method({key1, key2}) {
          return key1 + key2;
        }
      }

      const classInstance = _loggerHelper.serviceLogProxy(new Class());
      classInstance.method({key1: 18, key2: 42});
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith(
        expect.objectContaining({
          logMessage: "method [{}]",
        }),
      );
    });

    it("logs specified props", async () => {
      const {configureLog} = _loggerHelper.get();

      class Class {
        @configureLog({
          logArgsLambda: args => ({
            "key1.innerKey1.innerKey2": args[0]?.key1?.innerKey1?.innerKey2,
            "key2.innerKey3": args[1]?.key2?.innerKey3,
            user: args[2]?.user,
          }),
        })
        method(param1, param2, param3) {
          return param1 + param2 + param3;
        }
      }

      const classInstance = _loggerHelper.serviceLogProxy(new Class());
      classInstance.method(
        {key1: {innerKey1: {innerKey2: 18}}},
        {key2: {innerKey3: {innerKey4: 42}}},
        {user},
      );
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith(
        expect.objectContaining({
          logMessage:
            'method [{"key1.innerKey1.innerKey2":18,"key2.innerKey3":{"innerKey4":42},"user":{"login":"user","password":"***"}}]',
        }),
      );
    });

    it("logs fail if lambda throws", async () => {
      const {configureLog} = _loggerHelper.get();

      class Class {
        @configureLog({
          logArgsLambda: args => ({
            unexistedProp: args[0].unexistedProp,
          }),
        })
        method(params?) {
          return params;
        }
      }

      const classInstance = _loggerHelper.serviceLogProxy(new Class());
      classInstance.method();
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith(
        expect.objectContaining({
          logMessage:
            "method [Failed to log args: TypeError: Cannot read properties of undefined (reading 'unexistedProp')]",
        }),
      );
    });
  });
});
