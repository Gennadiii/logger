import {serviceProxyDecorator} from "./logger_DIFF";
import {LandingPo, LoginPo} from "./pages";
import {SomeVeryLongNameForLoginService} from "./services_DIFF";

export const service = {
  login: serviceFactory({
    Service: SomeVeryLongNameForLoginService,
    Pages: [LoginPo, LandingPo],
  }) as SomeVeryLongNameForLoginService,
};

function serviceFactory(params: serviceFactoryInterface) {
  const {Pages, Service} = params;
  const pageInstances = Pages.map(Page => new Page());
  return serviceProxyDecorator(new Service(...pageInstances)); // diff
}

interface serviceFactoryInterface {
  Service: Constructable;
  Pages: Constructable[];
}

interface Constructable {
  new (...args: any[]): any;
}
