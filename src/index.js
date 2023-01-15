import React from "react";
import ReactDOM from "react-dom/client";
import {
  sampleAppointments,
  sampleAvailableTimeSlots,
} from "../data/sampleData";
import { App } from "./App";
import { AppointmentForm } from "./AppointmentForm";
import { AppointmentsDayView } from "./AppointmentsDayView";
import { CustomerForm } from "./CustomerForm";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
