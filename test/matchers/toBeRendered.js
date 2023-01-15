import { matcherHint } from "jest-matcher-utils";

export const toBeRendered = (mockedComponent) => {
  const pass = mockedComponent?.mock?.calls[0] ? true : false;

  const message = () =>
    matcherHint("toBeRendered", "mockedComponent", "", { isNot: pass });

  return { pass, message };
};
