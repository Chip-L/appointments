import React from "react";
import { AppointmentForm } from "../src/AppointmentForm";
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
    render(<AppointmentForm />);
    expect(form()).not.toBeNull();
  });

  describe("service field", () => {
    it("renders as a select box", () => {
      render(<AppointmentForm />);
      expect(field("service")).not.toBeNull();
      expect(field("service").tagName).toEqual("SELECT");
    });
  });
});
