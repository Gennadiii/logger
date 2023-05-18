import {pageLogProxyDecorator, serviceProxyDecorator} from "./logger_DIFF0";
import {LandingPo, LoginPo} from "./pages_DIFF3";
import {SomeVeryLongNameForLoginService} from "./services";

export const service = {
  login: serviceFactory({
    Service: SomeVeryLongNameForLoginService,
    Pages: [LoginPo, LandingPo],
  }) as SomeVeryLongNameForLoginService,
};

function serviceFactory(params: serviceFactoryInterface) {
  const {Pages, Service} = params;
  const pageInstances = Pages.map(Page => pageLogProxyDecorator(new Page())); // DIFF
  return serviceProxyDecorator(new Service(...pageInstances));
}

interface serviceFactoryInterface {
  Service: Constructable;
  Pages: Constructable[];
}

interface Constructable {
  new (...args: any[]): any;
}
