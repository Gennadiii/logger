import {describe, expect, jest} from "@jest/globals";
import { processHelper } from "../../../../helpers/process/process.helper";

describe("logger utils baseLogger getBaseName", () => {
  describe("prefix for", () => {
    it("service", async () => {
      expect(
        (await import("../../baseLogger")).baseLogger
          .getBaseName("SomeService")
          .slice(0, 2),
      ).toEqual("++");
    });

    it("page object", async () => {
      expect(
        (await import("../../baseLogger")).baseLogger
          .getBaseName("MyPo")
          .slice(0, 3),
      ).toEqual("---");
    });

    it("api helper", async () => {
      expect(
        (await import("../../baseLogger")).baseLogger
          .getBaseName("CoolApiHelper")
          .slice(0, 2),
      ).toEqual("^^");
    });
  });

  it("shortens base name", async () => {
    jest.resetModules();
    processHelper.mock.getPid(() => "pid");
    jest.mock("../../nameShortener", () => ({
      nameShortener: {name1: "n1", name2: "n2"},
    }));
    const baseLogger = (await import("../../baseLogger")).baseLogger;
    expect(baseLogger.getBaseName("name1Name")).toEqual(
      "n1Name_pid".padEnd(32),
    );
    expect(baseLogger.getBaseName("Myname2Name")).toEqual(
      "Myn2Name_pid".padEnd(32),
    );
    expect(baseLogger.getBaseName("Name1")).toEqual("Name1_pid".padEnd(32));
  });
});
