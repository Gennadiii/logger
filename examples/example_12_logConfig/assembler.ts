import {pageLogProxyDecorator, serviceProxyDecorator} from "./logger_DIFF2";
import {LandingPo, LoginPo} from "./pages";
import {SomeVeryLongNameForLoginService} from "./services_DIFF1";

export const service = {
  login: serviceFactory({
    Service: SomeVeryLongNameForLoginService,
    Pages: [LoginPo, LandingPo],
  }) as SomeVeryLongNameForLoginService,
};

function serviceFactory(params: serviceFactoryInterface) {
  const {Pages, Service} = params;
  const pageInstances = Pages.map(Page => pageLogProxyDecorator(new Page()));
  return serviceProxyDecorator(new Service(...pageInstances));
}

interface serviceFactoryInterface {
  Service: Constructable;
  Pages: Constructable[];
}

interface Constructable {
  new (...args: any[]): any;
}
