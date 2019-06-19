import { browser, ElementArrayFinder, ElementFinder } from 'protractor';
import { DEFAULT_TIMEOUT } from '../shared/timeouts';
import { findAllBySelector, findBySelector, selectBy } from '../shared/utils';

type MediaListItemInfo = {
  groupByTitle?: string;
  topTitle: string;
  bottomTitle?: string;
  coverImageUrl?: string;
  highlighted?: boolean;
};

class MediaListFragment {
  public readonly containerElement: ElementFinder = findBySelector('media-list-container');
  public readonly itemsElements: ElementArrayFinder = findAllBySelector('media-list-item');
  private readonly groupByTitleSelector: string = selectBy('media-list-group-by-title');
  private readonly bottomTitleSelector: string = selectBy('media-list-bottom-title');
  private readonly topTitleSelector: string = selectBy('media-list-top-title');
  private readonly coverImageUrlSelector: string = selectBy('media-list-top-title');
  private readonly itemHighlightedClass: string = 'media-list__item--highlighted';
  private readonly selectContainerHtmlElement: string = `document.querySelector('${selectBy('media-list-container')}')`;

  public async waitForItemsBeingShown(): Promise<void> {
    await browser.wait(async () => {
      const items = await this.itemsElements;

      return items.length > 0;
    }, DEFAULT_TIMEOUT, 'Media list items taking too long to appear in the DOM');
  }

  public async getAllItems(
    prevScrollTopPosition?: number,
    accumulatedItems: Array<MediaListItemInfo> = []
  ): Promise<Array<MediaListItemInfo>> {
    const items = await this.getItems();
    const nextScrollPosition = await this.scrollDown();

    if (nextScrollPosition === prevScrollTopPosition && prevScrollTopPosition !== undefined) {
      return accumulatedItems;
    }
    return await this.getAllItems(
      nextScrollPosition,
      [
        ...accumulatedItems,
        ...items.filter(item => !accumulatedItems.find(
          accItem => item.topTitle + item.bottomTitle === accItem.topTitle + accItem.bottomTitle
        ))
      ]
    );
  }

  public async getItems(): Promise<Array<MediaListItemInfo>> {
    const items: Array<ElementFinder> = await this.itemsElements;

    return await items.reduce((async (result, item) => {
      const groupByTitle$ = item.$(this.groupByTitleSelector);
      const bottomTitleElement = item.$(this.bottomTitleSelector);
      const topTitleElement = item.$(this.topTitleSelector);
      const coverImageUrlElement = item.$(this.coverImageUrlSelector);

      return [
        ...(await result),
        {
          bottomTitle: await bottomTitleElement.isPresent() && await bottomTitleElement.getText(),
          topTitle: await topTitleElement.isPresent() && await topTitleElement.getText(),
          coverImageUrl: await coverImageUrlElement.isPresent() && await coverImageUrlElement.getCssValue('background-image'),
          groupByTitle: await groupByTitle$.isPresent() && await groupByTitle$.getText(),
          highlighted: await item
            .getAttribute('class')
            .then(classes => classes.split('\s')
              .includes(this.itemHighlightedClass)
            )
        }
      ];
    }), Promise.resolve([]));
  }

  public async scrollDown(): Promise<number> {
    const size = await this.containerElement.getSize();
    const currentScrollTop: number = await this.getCurrentScrollPosition();

    await this.scrollTo(currentScrollTop + size.height);

    return await this.getCurrentScrollPosition();
  }

  private async getCurrentScrollPosition(): Promise<number> {
    return await browser.executeScript(
      `return ${this.selectContainerHtmlElement}.scrollTop`
    );
  }

  private async scrollTo(targetScrollPosition: number): Promise<void> {
    await browser.executeScript(
      `${this.selectContainerHtmlElement}.scrollTo(0, ${targetScrollPosition})`
    );
  }
}

export { MediaListFragment, MediaListItemInfo };
