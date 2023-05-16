import {LandingPo, LoginPo} from "./pages_DIFF";

export class SomeVeryLongNameForLoginService {
  constructor(public loginPage: LoginPo, private landingPage: LandingPo) {}

  async using(params: usingInterface): Promise<void> {
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

