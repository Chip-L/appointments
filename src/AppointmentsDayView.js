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

export const Appointment = (props) => {
  const { customer, startsAt, stylist, service } = props;
  // console.log(props);
  return (
    <div id="appointmentView">
      <h3>Today's appointment at {appointmentTimeOfDay(startsAt)}</h3>
      <table>
        <tbody>
          <tr>
            <td>Customer</td>
            <td>
              {customer.firstName} {customer.lastName}
            </td>
          </tr>
          <tr>
            <td>Phone Number</td>
            <td>{formatPhoneNumber(customer.phoneNumber)}</td>
          </tr>
          <tr>
            <td>Stylist</td>
            <td>{stylist}</td>
          </tr>
          <tr>
            <td>Service</td>
            <td>{service}</td>
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
