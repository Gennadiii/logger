import {LandingPo, LoginPo} from "./pages";

export class SomeVeryLongNameForLoginService {
  constructor(public loginPage: LoginPo, private landingPage: LandingPo) {
  }

  async using(params: usingInterface): Promise<void> {
    const {email, password} = params;
    await this.loginPage.getModeButton("admin").click();
    await this.loginPage.getInputs("admin").emailInputField.enterText(email);
    await this.loginPage
      .getInputs("admin")
      .passwordInputField.enterText(password);
    await this.loginPage.signInButton.click();
    await this.landingPage.verifyIsOpen();
  }

}

interface usingInterface {
  email: string;
  password: string;
}
