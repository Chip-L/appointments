import { matcherHint } from "jest-matcher-utils";

export const toBeRendered = (mockedComponent) => {
  const pass = mockedComponent?.mock.calls.length > 0;

  const message = () => matcherHint("toBeRendered", "mockedComponent", "", {});

  return { pass, message };
};
