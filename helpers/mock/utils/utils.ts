import pathLib from "path";
import {Mocks} from "../mock.helper";
import {stringHelper} from "../../string/string.helper";

export const utils = {
  getExportedNameByFilePath(filePath: string): string {
    const fileName = pathLib.basename(filePath).replace(".ts", "");
    const nameParts = fileName.split(".");
    return `${nameParts.shift()}${nameParts
      .map(namePart => stringHelper.capitalize(namePart))
      .join("")}`;
  },

  buildMocks(mocks: Mocks): Record<string, unknown> {
    const builtMocks = {};
    mocks.forEach(mock => (builtMocks[mock.propName] = mock.mockValue));
    return builtMocks;
  },
};
