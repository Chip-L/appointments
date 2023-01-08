import React from "react";
import ReactDOM from "react-dom/client";
import {
  sampleAppointments,
  sampleAvailableTimeSlots,
} from "../data/sampleData";
import { AppointmentForm } from "./AppointmentForm";
import { AppointmentsDayView } from "./AppointmentsDayView";
import { CustomerForm } from "./CustomerForm";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AppointmentsDayView appointments={sampleAppointments} />
    <AppointmentForm
      original={{}}
      availableTimeSlots={sampleAvailableTimeSlots}
      appointments={sampleAppointments}
      onSubmit={console.log}
    />
    <CustomerForm
      original={{ firstName: "", lastName: "", phoneNumber: "" }}
      onSubmit={console.log}
    />
  </React.StrictMode>
);
