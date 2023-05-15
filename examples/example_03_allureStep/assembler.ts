import {LandingPo, LoginPo} from "./pages";
import {LoginService} from "./services";

export const service = {
  login: serviceFactory({
    Service: LoginService,
    Pages: [LoginPo, LandingPo],
  }) as LoginService,
};

function serviceFactory(params: serviceFactoryInterface) {
  const {Pages, Service} = params;
  return new Service(...Pages.map(Page => new Page()));
}

interface serviceFactoryInterface {
  Service: Constructable;
  Pages: Constructable[];
}

interface Constructable {
  new (...args: any[]): unknown;
}
