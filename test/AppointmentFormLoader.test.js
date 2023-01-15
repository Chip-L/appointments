import React from "react";
import { AppointmentForm } from "../src/AppointmentForm";
import { AppointmentFormLoader } from "../src/AppointmentFormLoader";
import {
  element,
  initializeReactContainer,
  renderAndWait,
} from "./reactTestExtensions";

jest.mock("../src/AppointmentForm", () => ({
  AppointmentForm: jest.fn(() => <div id="AppointmentForm" />),
}));

describe("AppointmentFormLoader", () => {
  beforeEach(() => {
    initializeReactContainer();
  });

  it("renders an AppointmentForm", async () => {
    await renderAndWait(<AppointmentFormLoader />);
    expect(element("#AppointmentForm")).not.toBeNull();
  });
});
