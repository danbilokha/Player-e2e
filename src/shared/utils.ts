import { $, $$, ElementArrayFinder, ElementFinder, protractor } from 'protractor';

type FinderFunction<T = ElementFinder | ElementArrayFinder> = (selector: string) => T;

const selectBy = (selector: string): string => `[data-selector="${selector}"]`;

const findBySelector: FinderFunction<ElementFinder> =
  selector => $(selectBy(selector));

const findAllBySelector: FinderFunction<ElementArrayFinder> =
  selector => $$(selectBy(selector));

const EC = protractor.ExpectedConditions;

export { findBySelector, findAllBySelector, EC, selectBy };
