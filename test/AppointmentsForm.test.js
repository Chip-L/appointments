import React from "react";
import { AppointmentsForm } from "../src/AppointmentsForm";
import {
  field,
  form,
  initializeReactContainer,
  render,
} from "./reactTestExtensions";

describe("AppointmentsForm", () => {
  beforeEach(() => {
    initializeReactContainer();
  });

  it("renders a from", () => {
    render(<AppointmentsForm />);
    expect(form()).not.toBeNull();
  });

  describe("service field", () => {
    it("renders as a select box", () => {
      render(<AppointmentsForm />);
      expect(field("service")).not.toBeNull();
      expect(field("service").tagName).toEqual("SELECT");
    });
  });
});
