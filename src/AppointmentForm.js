import React, { useCallback, useState } from "react";

const timeIncrements = (numTimes, startTime, increment) =>
  Array(numTimes)
    .fill([startTime])
    .reduce((acc, _, i) => acc.concat([startTime + i * increment]));

const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
  const totalSlots = (salonClosesAt - salonOpensAt) * 2;
  const startTime = new Date().setHours(salonOpensAt, 0, 0, 0); // assumes the salon opens on the hour
  const increment = 30 * 60 * 1000; // 30 minutes in milliseconds (30 should be a variable)
  return timeIncrements(totalSlots, startTime, increment);
};

const toTimeValue = (timestamp) =>
  new Date(timestamp).toTimeString().substring(0, 5);

const weeklyDateValues = (startDate) => {
  const midnight = startDate.setHours(0, 0, 0, 0);
  const increment = 24 * 60 * 60 * 1000;
  return timeIncrements(7, midnight, increment);
};

const toShortDate = (timestamp) => {
  const [day, , dayOfMonth] = new Date(timestamp).toDateString().split(" ");
  return `${day} ${dayOfMonth}`;
};

const mergeDateAndTime = (date, timeSlot) => {
  const time = new Date(timeSlot);
  return new Date(date).setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
};

const RadioButtonIfAvailable = ({
  availableTimeSlots,
  date,
  timeSlot,
  checkedTimeSlot,
  handleChange,
}) => {
  const startsAt = mergeDateAndTime(date, timeSlot);
  if (availableTimeSlots.some((a) => a.startsAt === startsAt)) {
    const isChecked = startsAt === checkedTimeSlot;
    return (
      <input
        name="startsAt"
        type="radio"
        value={startsAt}
        checked={isChecked}
        onChange={handleChange}
      />
    );
  }
  return null;
};

const TimeSlotTable = ({
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  checkedTimeSlot,
  handleChange,
}) => {
  const dates = weeklyDateValues(today);
  const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt);
  return (
    <table id="time-slots">
      <thead>
        <tr>
          <th />
          {dates.map((d) => (
            <th key={d}>{toShortDate(d)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((timeSlot) => (
          <tr key={timeSlot}>
            <th>{toTimeValue(timeSlot)}</th>
            {dates.map((date) => (
              <td key={date}>
                <RadioButtonIfAvailable
                  availableTimeSlots={availableTimeSlots}
                  date={date}
                  timeSlot={timeSlot}
                  checkedTimeSlot={checkedTimeSlot}
                  handleChange={handleChange}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const AppointmentForm = ({
  original,
  selectableServices,
  selectableStylists,
  serviceStylists,
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  onSubmit,
}) => {
  const [appointment, setAppointment] = useState(original);

  const stylistsForService = appointment.service
    ? serviceStylists[appointment.service]
    : selectableStylists;

  const timeSlotsForStylist = appointment.stylist
    ? availableTimeSlots.filter((slot) =>
        slot.stylists.includes(appointment.stylist)
      )
    : availableTimeSlots;

  const handleStartsAtChange = useCallback(
    ({ target: { value } }) =>
      setAppointment((appointment) => ({
        ...appointment,
        startsAt: parseInt(value),
      })),
    []
  );

  const handleSelectBoxChange = ({ target: { name, value } }) => {
    setAppointment((appointment) => ({ ...appointment, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    global.fetch("/appointments", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
    });
    onSubmit(appointment);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="service">Salon service</label>
      <select
        name="service"
        id="service"
        value={appointment.service}
        onChange={handleSelectBoxChange}
      >
        <option />
        {selectableServices.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <label htmlFor="stylist">Stylist</label>
      <select
        id="stylist"
        name="stylist"
        value={appointment.stylist}
        onChange={handleSelectBoxChange}
      >
        <option />
        {stylistsForService.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <TimeSlotTable
        salonOpensAt={salonOpensAt}
        salonClosesAt={salonClosesAt}
        today={today}
        availableTimeSlots={timeSlotsForStylist}
        checkedTimeSlot={appointment.startsAt}
        handleChange={handleStartsAtChange}
      />
      <input type="submit" value="Add" />
    </form>
  );
};

AppointmentForm.defaultProps = {
  today: new Date(),
  salonOpensAt: 9,
  salonClosesAt: 19,
  selectableServices: [
    "Cut",
    "Blow-dry",
    "Cut & color",
    "Beard trim",
    "Cut & beard trim",
    "Extensions",
  ],
  selectableStylists: ["Ashley", "Jo", "Pat", "Sam"],
  serviceStylists: {
    Cut: ["Ashley", "Jo", "Pat", "Sam"],
    "Blow-dry": ["Ashley", "Jo", "Pat", "Sam"],
    "Cut & color": ["Ashley", "Jo"],
    "Beard trim": ["Pat", "Sam"],
    "Cut & beard trim": ["Pat", "Sam"],
    Extensions: ["Ashley", "Pat"],
  },
};
