import React from "react";
import { AppointmentsDayViewLoader } from "./AppointmentsDayViewLoader";

export const App = () => {
  return (
    <>
      <menu>
        <li>
          <button type="button">Add customer and appointment</button>
        </li>
      </menu>
      <AppointmentsDayViewLoader />
    </>
  );
};
