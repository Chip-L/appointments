import { matcherHint } from "jest-matcher-utils";

export const toBeRendered = (mockedComponent) => {
  const pass = mockedComponent?.mock?.calls[0] ? true : false;

  const sourceHint = () =>
    matcherHint("toBeRendered", "mockedComponent", "", { isNot: pass });

  const actualHint = () => {
    if (!mockedComponent?.mock) {
      return `mockedComponent is not a mock`;
    }
    if (!pass) {
      return `Mocked component was never rendered`;
    }
  };

  const message = () => [sourceHint(), actualHint()].join("\n\n");

  return { pass, message };
};
