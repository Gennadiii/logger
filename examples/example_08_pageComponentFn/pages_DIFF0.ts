import {BaseComponent, Button, InputField} from "./components";

abstract class BasePo {
  abstract staticElement: BaseComponent;

  async isOpen(): Promise<boolean> {
    return this.staticElement.isDisplayed();
  }

  async verifyIsOpen(): Promise<void> {
    if (!(await this.isOpen())) {
      throw new Error(`${this.constructor.name} is not opened`);
    }
  }

  async sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
}

export class LoginPo extends BasePo {
  input = {
    emailInputField: new InputField("emailLocator"),
    passwordInputField: new InputField("passwordLocator"),
  };
  signInButton = new Button("signInButtonLocator");

  constructor() {
    super();
  }

  get staticElement() {
    return this.input.emailInputField;
  }

  getModeButton(mode: string): Button { // diff
    return new Button(`modeLocator_${mode}`);
  }
}

export class LandingPo extends BasePo {
  userProfileButton = new Button("userProfileButtonLocator");

  constructor() {
    super();
  }

  get staticElement() {
    return this.userProfileButton;
  }
}
