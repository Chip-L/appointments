import React from "react";
import { initializeReactContainer, render } from "../reactTestExtensions";
import { stripTerminalColor } from "./matcherUtils";
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

  it("returns pass is false when mock has not been rendered", () => {
    const result = toBeRenderedWithProps(Component, {});
    expect(result.pass).toBe(false);
  });

  it("returns pass is false when the properties do not match", () => {
    render(<Component a="b" />);
    const result = toBeRenderedWithProps(Component, { c: "d" });
    expect(result.pass).toBe(false);
  });

  it("returns pass is true when the properties of the last render match", () => {
    render(<Component a="b" />);
    render(<Component c="d" />);
    const result = toBeRenderedWithProps(Component, { c: "d" });
    expect(result.pass).toBe(true);
  });

  it("returns a message that contains the source line if no match", () => {
    render(<Component a="b" />);
    const result = toBeRenderedWithProps(Component, { c: "d" });
    expect(stripTerminalColor(result.message())).toContain(
      `expect(mockedComponent).toBeRenderedWithProps({"c": "d"})`
    );
  });
});
