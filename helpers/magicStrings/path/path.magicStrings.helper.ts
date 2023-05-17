import {Mock, mockHelper} from "../../mock/mock.helper";

export const pathMagicStringsHelper = {
  root: process.cwd(),
  get tsConfigJson(): string {
    return `${this.root}/tsconfig.json`;
  },

  get mock() {
    return {
      root: mockValue => getMock({propName: "root", mockValue}),
    };
  },
};

function getMock(mock: Mock) {
  return mockHelper.buildMock({filePath: __filename, mocks: [mock]});
}
