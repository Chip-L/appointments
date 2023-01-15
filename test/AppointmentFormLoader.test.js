import React from "react";
import { AppointmentForm } from "../src/AppointmentForm";
import { AppointmentFormLoader } from "../src/AppointmentFormLoader";
import { fetchResponseOk } from "./builders/fetch";
import { todayAt } from "./builders/time";
import {
  element,
  initializeReactContainer,
  renderAndWait,
} from "./reactTestExtensions";

jest.mock("../src/AppointmentForm", () => ({
  AppointmentForm: jest.fn(() => <div id="AppointmentForm" />),
}));

describe("AppointmentFormLoader", () => {
  const availableTimeSlots = [{ when: todayAt(9) }];

  beforeEach(() => {
    console.log(expect.getState().currentTestName);
    initializeReactContainer();
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(fetchResponseOk(availableTimeSlots));
  });

  it("renders an AppointmentForm", async () => {
    await renderAndWait(<AppointmentFormLoader />);
    expect(element("#AppointmentForm")).not.toBeNull();
  });

  it("initially passes empty array of time slots to AppointmentsForm", async () => {
    renderAndWait(<AppointmentFormLoader />);
    expect(AppointmentForm).toBeRenderedFirstWithProps({
      availableTimeSlots: [],
    });
  });

  it("fetches data when component is mounted", async () => {
    await renderAndWait(<AppointmentFormLoader />);

    expect(global.fetch).toBeCalledWith(
      "/availableTimeSlots",
      expect.objectContaining({
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  });
});

/*
interface Appointment {
  service: 
    | "Cut"
    | "Blow-dry"
    | "Cut & color"
    | "Beard trim"
    | "Cut & beard trim"
    | "Extensions"
  stylist: "Ashley" | "Jo" | "Pat" | "Sam"
  startsAt: number
}
*/
