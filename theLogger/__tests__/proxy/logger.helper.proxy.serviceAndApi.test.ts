import {beforeEach, describe, expect, jest} from "@jest/globals";
import {loggerHelper} from "../../logger.helper";
import {serviceAndApiLogProxy} from "../../utils/serviceAndApi/serviceAndApiLogProxy";
import {LogLevel} from "../../logger.types";

let _loggerHelper: typeof loggerHelper = null;
let serviceAndApiLogProxyGet = null;
const obj = {};

describe("logger helper proxy serviceAndApi", () => {
  beforeEach(async () => {
    jest.resetModules();
    serviceAndApiLogProxy.mock.get(
      (serviceAndApiLogProxyGet = jest.fn(() => 42)),
    );
    _loggerHelper = (await import("../../logger.helper")).loggerHelper;
  });

  it("service", () => {
    expect(_loggerHelper.serviceLogProxy(obj)).toEqual(42);
    expect(serviceAndApiLogProxyGet).toHaveBeenCalledWith(obj, LogLevel.info);
  });

  it("api", () => {
    expect(_loggerHelper.apiLogProxy(obj)).toEqual(42);
    expect(serviceAndApiLogProxyGet).toHaveBeenCalledWith(obj, LogLevel.trace);
  });
});
