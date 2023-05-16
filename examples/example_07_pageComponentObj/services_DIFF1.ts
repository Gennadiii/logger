import {LandingPo, LoginPo} from "./pages_DIFF0";

export class SomeVeryLongNameForLoginService {
  constructor(public loginPage: LoginPo, private landingPage: LandingPo) {}

  async using(params: usingInterface): Promise<void> {
    const {email, password} = params;
    await this.loginPage.input.emailInputField.enterText(email); // diff
    await this.loginPage.input.passwordInputField.enterText(password); // diff
    await this.loginPage.signInButton.click();
    await this.landingPage.verifyIsOpen();
  }
}

interface usingInterface {
  email: string;
  password: string;
}

