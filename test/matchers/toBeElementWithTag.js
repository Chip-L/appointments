import { matcherHint, printExpected } from "jest-matcher-utils";

export const toBeElementWithTag = (element, expectedTagName) => {
  const pass = element?.tagName === expectedTagName.toUpperCase();

  const message = () =>
    matcherHint(
      "toBeElementWithTag",
      "element",
      printExpected(expectedTagName),
      { isNot: pass }
    );

  return { pass, message };
};
