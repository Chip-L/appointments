import React from "react";
import ReactDOM from "react-dom/client";
import { sampleAppointments } from "../data/sampleData";
import { AppointmentsDayView } from "./AppointmentsDayView";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AppointmentsDayView appointments={sampleAppointments} />
  </React.StrictMode>
);
