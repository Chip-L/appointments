import React from "react";

export const toBeRenderedWithProps = (mockedComponent) => {
  const pass = mockedComponent.mock.calls.length > 0;
  return { pass };
};
