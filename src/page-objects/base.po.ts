import { browser, ElementFinder } from 'protractor';
import { LOADING_TIMEOUT } from '../shared/timeouts';
import { EC, findBySelector } from '../shared/utils';

abstract class BasePage {
  protected url: string;
  public readonly loader$: ElementFinder = findBySelector('loader');

  public async navigateTo(): Promise<void> {
    return await browser.get(this.url);
  }

  public async waitForLoaderIsPresent(): Promise<void> {
    await browser.wait(
      EC.presenceOf(this.loader$),
      LOADING_TIMEOUT,
      'Loader taking too long to appear in the DOM'
    );
  }

  public async waitForLoaderIsAbsent(): Promise<void> {
    await browser.wait(
      EC.invisibilityOf(this.loader$),
      LOADING_TIMEOUT,
      'Loader taking too long to disappear from the DOM'
    );
  }
}

export {
  BasePage
};
