import { equals } from "@jest/expect-utils";
import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";

export const toBeRenderedWithProps = (mockedComponent, expectedProps) => {
  const mockedCall = mockedComponent?.mock?.calls.at(-1);
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
    if (!mockedComponent || !mockedComponent.mock) {
      return `mockedComponent is not a mock`;
    }
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

export const toBeRenderedFirstWithProps = (mockedComponent, expectedProps) => {
  const mockedCall = mockedComponent?.mock?.calls[0];
  const actualProps = mockedCall ? mockedCall[0] : null;
  const pass = equals(actualProps, expectedProps);

  console.log(pass);
  const sourceHint = () =>
    matcherHint(
      "toBeRenderedFirstWithProps",
      "mockedComponent",
      printExpected(expectedProps),
      { isNot: pass }
    );

  const actualHint = () => {
    if (!mockedComponent) {
      return "mockedComponent is not a mock";
    }
    if (!mockedComponent.mock) {
      return "Mocked component was never rendered";
    }
  };
  const message = () => [sourceHint(), actualHint].join("/n/n");

  console.log({
    calls: mockedComponent
      ? mockedComponent.mock?.calls.map((call) => call[0])
      : undefined,
    mockedCall,
    actualProps,
    expectedProps,
    sourceHint: sourceHint(),
    actualHint: actualHint(),
    message: message(),
  });

  return { pass, message };
};
