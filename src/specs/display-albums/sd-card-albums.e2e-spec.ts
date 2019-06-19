import { SdCardAlbumsPage } from '../../page-objects/sd-card-albums.po';

describe('SdCard albums', () => {
  const page: SdCardAlbumsPage = new SdCardAlbumsPage();

  it('should display correct amount of albums', async () => {
    await page.navigateTo();
    await page.waitForLoaderIsPresent();
    await page.waitForLoaderIsAbsent();
    await page.mediaList.waitForItemsBeingShown();

    const expectedSdCardAlbumsCount = 195;
    const mediaItems = await page.mediaList.getAllItems();

    expect(mediaItems.length)
      .toBe(expectedSdCardAlbumsCount);
  });
});
