import React from "react";
import ReactDOM from "react-dom/client";
import { sampleAppointments } from "../data/sampleData";
import { AppointmentsDayView } from "./AppointmentsDayView";
import { CustomerForm } from "./CustomerForm";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <CustomerForm
      original={{ firstName: "", lastName: "", phoneNumber: "" }}
      onSubmit={console.log}
    />
  </React.StrictMode>
);
