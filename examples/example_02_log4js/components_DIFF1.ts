import {getLogger} from "./logger_DIFF0";

const log = {
  baseComponent: getLogger("BaseComponent"),
  inputField: getLogger("InputField"),
  button: getLogger("Button"),
}

export abstract class BaseComponent {
  protected constructor(public locator: string) {}

  async click(): Promise<void> {
    log.baseComponent.debug(`Click on ${this.locator}`);
    await this.sleep(200);
  }

  async isDisplayed(): Promise<boolean> {
    log.baseComponent.debug(`Check if ${this.locator} is displayed`);
    await this.sleep(300);
    return true;
  }

  async sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
}

export class InputField extends BaseComponent {
  constructor(public override locator: string) {
    super(locator);
  }

  async enterText(text: string): Promise<void> {
    log.inputField.debug(`Enter text ${text} in ${this.locator}`);
    await this.sleep(300);
  }
}

export class Button extends BaseComponent {
  constructor(public override locator: string) {
    super(locator);
  }
}
