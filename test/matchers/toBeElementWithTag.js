import { matcherHint, printExpected } from "jest-matcher-utils";

export const toBeElementWithTag = (element, expectedTagName) => {
  const pass = element?.tagName === expectedTagName.toUpperCase();

  const sourceHint = matcherHint(
    "toBeElementWithTag",
    "element",
    printExpected(expectedTagName),
    { isNot: pass }
  );

  const actualHint = `Actual: element was not found`;

  const message = () => [sourceHint, actualHint].join("\n\n");

  return { pass, message };
};
