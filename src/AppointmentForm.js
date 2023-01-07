import React from "react";

export const AppointmentForm = ({
  selectableServices,
  original,
  salonOpensAt,
  salonClosesAt,
}) => {
  return (
    <form>
      <select name="service" value={original.service} readOnly>
        <option />
        {selectableServices.map((service) => (
          <option key={service}>{service}</option>
        ))}
      </select>
    </form>
  );
};

AppointmentForm.defaultProps = {
  selectableServices: [
    "Cut",
    "Blow-dry",
    "Cut & color",
    "Beard trim",
    "Cut & beard trim",
    "Extensions",
  ],
};
