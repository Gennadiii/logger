import {configureLog, LogLevel} from "./logger_DIFF2";
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

  // <diff
  // @configureLog({shouldLog: false})
  secretMethod() {
    console.log("secretMethod log is absent");
  }

  // @configureLog({shouldLogArgs: false})
  secretArguments(args) {
    return args;
  }

  // @configureLog({logLevel: LogLevel.fatal})
  fatalMethod() {
    return null;
  }

  // @configureLog({
  //   logArgsLambda: (params: [hugeArgumentInterface]) => ({
  //     prop42: params[0].prop42,
  //   }),
  // })
  hugeArgument(params: hugeArgumentInterface) {
    return params.prop42;
  }

  // diff>
}

interface usingInterface {
  email: string;
  password: string;
}

export interface hugeArgumentInterface {
  prop42: number;
}
