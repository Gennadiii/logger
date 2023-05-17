import {beforeEach, describe, expect, jest} from "@jest/globals";
import {commonUtils} from "../commonUtils";
import {LogLevel} from "../../logger.types";

let log = null;
let service = null;

describe("logger utils serviceAndApiLogProxy get", () => {
  beforeEach(async () => {
    jest.resetModules();
    jest.resetModules();
    log = jest.fn(({getResult, result}) => result || getResult());
    commonUtils.mock.log(log);

    class MyService {
      prop = 42;

      syncAction(...args) {
        return args && 42;
      }

      async asyncAction(...args) {
        await Promise.resolve(args);
        return 42;
      }
    }

    service = (
      await import("../serviceAndApi/serviceAndApiLogProxy")
    ).serviceAndApiLogProxy.get(new MyService(), LogLevel.info);
  });

  it("logs sync action", () => {
    expect(service.syncAction(42, {prop: 18})).toEqual(42);
    expect(log).toBeCalledWith(
      getLogArgumentsByMessage('syncAction [[42,{"prop":18}]]'),
    );
  });

  it("logs async action", async () => {
    expect(await service.asyncAction(42, {prop: 18})).toEqual(42);
    expect(log).toBeCalledWith(
      getLogArgumentsByMessage('asyncAction [[42,{"prop":18}]]'),
    );
  });

  it("adds class name to func", async () => {
    expect(service.asyncAction.name).toEqual("MyService");
  });

  it("doesn't log properties", async () => {
    expect(service.prop).toEqual(42);
    expect(log).toHaveBeenCalledTimes(0);
  });

  describe("hides password", () => {
    it("password is the first param", async () => {
      await service.asyncAction(42, {password: "123456", prop: 18});
      expect(log).toBeCalledWith(
        getLogArgumentsByMessage(
          'asyncAction [[42,{"password":"***","prop":18}]]',
        ),
      );
    });

    it("password is the last param", async () => {
      await service.asyncAction({prop: 18, password: "superman"}, 42);
      expect(log).toBeCalledWith(
        getLogArgumentsByMessage(
          'asyncAction [[{"prop":18,"password":"***"},42]]',
        ),
      );
    });

    it("password is the middle param", async () => {
      await service.asyncAction(
        18,
        {prop1: 18, password: "batman", prop2: 42},
        42,
      );
      expect(log).toBeCalledWith(
        getLogArgumentsByMessage(
          'asyncAction [[18,{"prop1":18,"password":"***","prop2":42},42]]',
        ),
      );
    });

    it("password is the only param", async () => {
      await service.asyncAction({password: "qwerty"});
      expect(log).toBeCalledWith(
        getLogArgumentsByMessage(`asyncAction [[{"password":"***"}]]`),
      );
    });
  });
});

function getLogArgumentsByMessage(logMessage: string): unknown {
  return expect.objectContaining({
    logMessage,
    logLevel: LogLevel.info,
    name: "MyService",
  });
}
