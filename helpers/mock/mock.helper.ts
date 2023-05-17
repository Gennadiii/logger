import {utils} from "./utils/utils";

declare const jest;

export const mockHelper = {
  buildMock(params: buildMockInterface): void {
    const {mocks, filePath, exportedName} = params;
    jest.mock(filePath, () => {
      return {
        [exportedName || utils.getExportedNameByFilePath(filePath)]: {
          ...jest.requireActual(filePath)[exportedName],
          ...utils.buildMocks(mocks),
        },
      };
    });
  },

  buildNodeModulesMock(params: buildNodeModulesMockInterface): void {
    const {mocks, moduleName} = params;
    jest.mock(moduleName, () => {
      return {
        ...jest.requireActual(moduleName),
        ...utils.buildMocks(mocks),
      };
    });
  },
};

export type Mock = {
  mockValue: unknown;
  propName: string;
};

export type Mocks = Mock[];

interface buildMockInterface {
  exportedName?: string;
  filePath: string;
  mocks: Mocks;
}

interface buildNodeModulesMockInterface {
  moduleName: string;
  mocks: Mocks;
}
