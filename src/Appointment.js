import React, { useState } from "react";

const appointmentTimeOfDay = (time) => {
  const [h, m] = new Date(time).toTimeString().split(":");
  return `${h}:${m}`;
};

export const Appointment = ({ customer }) => <>{customer.firstName}</>;

export const AppointmentsDayView = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(0);

  return (
    <div id="appointmentsDayView">
      {/* left column */}
      <ol>
        {appointments.map((appointment, i) => (
          <li key={appointment.startsAt}>
            <button type="button" onClick={() => setSelectedAppointment(i)}>
              {appointmentTimeOfDay(appointment.startsAt)}
            </button>
          </li>
        ))}
      </ol>
      {/* right column */}
      {appointments.length === 0 ? (
        <p>There are no appointments scheduled for today.</p>
      ) : (
        <Appointment {...appointments[selectedAppointment]} />
      )}
    </div>
  );
};
