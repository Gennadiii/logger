import {magicStrings} from "../magicStrings/magicStrings.helper";
import fs from "fs";

export const tsConfigHelper = {
  setSourceMapTo(value: boolean): void {
    const configPath = magicStrings.path.tsConfigJson;
    const config = JSON.parse(fs.readFileSync(configPath).toString());
    config.compilerOptions.sourceMap = value;
    fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  },
};
