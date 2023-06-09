import {LandingPo, LoginPo} from "./pages";
import {logger} from "./logger_DIFF0";

const log = logger.get("LoginService");

export class LoginService {
  constructor(public loginPage: LoginPo, private landingPage: LandingPo) {}

  async using(params: usingInterface): Promise<void> {
    log.info(`Login using ${JSON.stringify(params)}`);
    const {email, password} = params;
    await this.loginPage.emailInputField.enterText(email);
    await this.loginPage.passwordInputField.enterText(password);
    await this.loginPage.signInButton.click();
    await this.landingPage.verifyIsOpen();
  }
}

interface usingInterface {
  email: string;
  password: string;
}

