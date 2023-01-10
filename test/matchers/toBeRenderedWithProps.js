import { equals } from "@jest/expect-utils";
import { matcherHint, printExpected } from "jest-matcher-utils";

export const toBeRenderedWithProps = (mockedComponent, expectedProps) => {
  const mockedCall = mockedComponent.mock.calls.at(-1);
  const actualProps = mockedCall ? mockedCall[0] : null;
  const pass = equals(actualProps, expectedProps);

  const sourceHint = () =>
    matcherHint(
      "toBeRenderedWithProps",
      "mockedComponent",
      printExpected(expectedProps),
      { isNot: pass }
    );

  const actualHintText = () => {
    if (!mockedCall) {
      return `Component was not found`;
    }
  };
  const actualHint = () => `Actual: ${actualHintText()}`;

  const message = () => [sourceHint(), actualHint()].join("\n\n");

  return { pass, message };
};
