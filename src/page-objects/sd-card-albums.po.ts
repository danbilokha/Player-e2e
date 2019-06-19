import { browser } from 'protractor';
import { MediaListFragment } from '../fragments/media-list.fragment';
import { BasePage } from './base.po';

export class SdCardAlbumsPage extends BasePage {
  public readonly url: string = `${browser.baseUrl}/#/usb-stick-media`;
  public readonly mediaList: MediaListFragment = new MediaListFragment();
}
