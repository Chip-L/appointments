import React from "react";
import { initializeReactContainer, render } from "../reactTestExtensions";
import { toBeRenderedWithProps } from "./toBeRenderedWithProps";

describe("toBeRenderedWithProps", () => {
  let Component;

  beforeEach(() => {
    initializeReactContainer();
    Component = jest.fn(() => <div />);
  });

  it("returns pass is true when mock has been rendered", () => {
    render(<Component />);
    const result = toBeRenderedWithProps(Component, {});
    expect(result.pass).toBe(true);
  });
});
