import {Mock, mockHelper} from "../mock/mock.helper";

let pid = null;

export const processHelper = {
  getPid(): string {
    if (pid) {
      return pid;
    }
    return process.pid.toString();
  },

  get mock() {
    return {
      getPid: mockValue => getMock({propName: this.getPid.name, mockValue}),
    };
  },
};

function getMock(mock: Mock) {
  return mockHelper.buildMock({filePath: __filename, mocks: [mock]});
}
