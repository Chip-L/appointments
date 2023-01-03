import React from "react";
import { CustomerForm } from "../src/CustomerForm";
import {
  element,
  form,
  initializeReactContainer,
  render,
} from "./reactTestExtensions";

describe("CustomerForm", () => {
  beforeEach(() => {
    initializeReactContainer();
  });

  it("renders a form", () => {
    render(<CustomerForm />);
    expect(form()).not.toBeNull();
  });
});
