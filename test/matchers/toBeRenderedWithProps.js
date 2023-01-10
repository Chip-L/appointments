import { equals } from "@jest/expect-utils";
import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";

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

  const actualHint = () => {
    if (!mockedCall) {
      return `Mocked component was never rendered`;
    }
    if (!equals(actualProps, expectedProps)) {
      return `Rendered with props: ${printReceived(actualProps)}`;
    }
  };

  const message = () => [sourceHint(), actualHint()].join("\n\n");

  return { pass, message };
};
