import React, { useEffect, useState } from "react";
import { AppointmentForm } from "./AppointmentForm";

export const AppointmentFormLoader = (props) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      const result = await global.fetch("/availableTimeSlots", {
        method: "GET",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      });
      const data = await result.json();
      console.log(data);
      setAvailableTimeSlots(data);
    };

    fetchAvailableTimeSlots();
  }, []);

  return <AppointmentForm {...props} availableTimeSlots={availableTimeSlots} />;
};
