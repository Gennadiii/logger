import {execSync} from "child_process";
import {tsConfigHelper} from "../../tsConfigHelper/tsConfig.helper";

export const utils = {
  runCoverage(): void {
    tsConfigHelper.setSourceMapTo(true);
    execSync("jest --coverage");
    tsConfigHelper.setSourceMapTo(false);
  },
};
