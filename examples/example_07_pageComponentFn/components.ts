import {classLogDecorator} from "./logger_DIFF2";

export abstract class BaseComponent {
  protected constructor(public locator: string) {}

  async click(): Promise<void> {
    await this.sleep(200);
  }

  async isDisplayed(): Promise<boolean> {
    await this.sleep(300);
    return true;
  }

  async sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
}

@classLogDecorator
export class InputField extends BaseComponent {
  constructor(public override locator: string) {
    super(locator);
  }

  async enterText(text: string): Promise<void> {
    await this.sleep(300);
  }
}

@classLogDecorator
export class Button extends BaseComponent {
  constructor(public override locator: string) {
    super(locator);
  }
}
