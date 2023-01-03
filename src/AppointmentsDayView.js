import React, { useState } from "react";

const appointmentTimeOfDay = (time) => {
  const [h, m] = new Date(time).toTimeString().split(":");
  return `${h}:${m}`;
};

const formatPhoneNumber = (number) => {
  if (!number) return "number";
  const num = {
    areaCode: number.slice(0, 3),
    exchange: number.slice(3, 6),
    number: number.slice(6),
  };
  return `(${num.areaCode}) ${num.exchange}-${num.number}`;
};

export const Appointment = ({
  customer,
  startsAt,
  stylist,
  service,
  notes,
}) => {
  return (
    <div id="appointmentView">
      <h3>Today's appointment at {appointmentTimeOfDay(startsAt)}</h3>
      <table>
        <tbody>
          <tr>
            <th>Customer</th>
            <td>
              {customer.firstName} {customer.lastName}
            </td>
          </tr>
          <tr>
            <th>Phone Number</th>
            <td>{formatPhoneNumber(customer.phoneNumber)}</td>
          </tr>
          <tr>
            <th>Stylist</th>
            <td>{stylist}</td>
          </tr>
          <tr>
            <th>Service</th>
            <td>{service}</td>
          </tr>
          <tr>
            <th>Notes</th>
            <td>{notes}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export const AppointmentsDayView = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(0);

  return (
    <div id="appointmentsDayView">
      {/* left column */}
      <ol>
        {appointments.map((appointment, i) => (
          <li key={appointment.startsAt}>
            <button
              type="button"
              className={selectedAppointment === i ? "toggled" : ""}
              onClick={() => setSelectedAppointment(i)}
            >
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
