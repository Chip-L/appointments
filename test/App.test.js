import React from "react";
import {
  click,
  element,
  initializeReactContainer,
  render,
} from "./reactTestExtensions";
import { AppointmentsDayViewLoader } from "../src/AppointmentsDayViewLoader";
import { CustomerForm } from "../src/CustomerForm";
import { App } from "../src/App";

jest.mock("../src/AppointmentsDayViewLoader", () => ({
  AppointmentsDayViewLoader: jest.fn(() => (
    <div id="AppointmentsDayViewLoader" />
  )),
}));

jest.mock("../src/CustomerForm", () => ({
  CustomerForm: jest.fn(() => <div id="CustomerForm" />),
}));

describe("App", () => {
  beforeEach(() => {
    initializeReactContainer();
  });

  it("initially shows the AppointmentsDayViewLoader", () => {
    render(<App />);

    expect(AppointmentsDayViewLoader).toBeRendered();
  });

  it("has a menu bar", () => {
    render(<App />);
    expect(element("menu")).not.toBeNull();
  });

  it("has a button to initiate add customer and appointment action", () => {
    render(<App />);
    const firstButton = element("menu > li > button:first-of-type");
    expect(firstButton).toContainText("Add customer and appointment");
  });

  it("displays the CustomerForm when button is clicked", () => {
    render(<App />);
    click(element("menu > li > button:first-of-type"));
    expect(element("#CustomerForm")).not.toBeNull();
  });
});
