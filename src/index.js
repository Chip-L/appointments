import React from "react";
import ReactDOM from "react-dom/client";
import { sampleAppointments } from "../data/sampleData";
import { AppointmentForm } from "./AppointmentForm";
import { AppointmentsDayView } from "./AppointmentsDayView";
import { CustomerForm } from "./CustomerForm";

const root = ReactDOM.createRoot(document.getElementById("root"));

const blankAppointment = {
  service: "",
};
const today = new Date();
const availableTimeSlots = [
  { startsAt: today.setHours(9, 0, 0, 0) },
  { startsAt: today.setHours(9, 30, 0, 0) },
];

root.render(
  <React.StrictMode>
    <AppointmentForm
      original={blankAppointment}
      availableTimeSlots={availableTimeSlots}
    />

    {/* <CustomerForm
      original={{ firstName: "", lastName: "", phoneNumber: "" }}
      onSubmit={console.log}
    /> */}
  </React.StrictMode>
);
