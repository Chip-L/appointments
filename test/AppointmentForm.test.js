import React from "react";
import { AppointmentForm } from "../src/AppointmentForm";
import { today, todayAt, tomorrowAt } from "./builders/time";
import {
  change,
  click,
  element,
  elements,
  field,
  form,
  initializeReactContainer,
  labelFor,
  render,
  submit,
  submitButton,
} from "./reactTestExtensions";

describe("AppointmentsForm", () => {
  const blankAppointment = {
    service: "",
  };
  const availableTimeSlots = [
    { startsAt: todayAt(9, 0, 0, 0) },
    { startsAt: todayAt(9, 30) },
  ];
  const services = ["Cut", "Blow-dry"];

  const testProps = {
    today,
    selectableServices: services,
    availableTimeSlots,
    original: blankAppointment,
  };

  beforeEach(() => {
    initializeReactContainer();
  });

  const startsAtField = (index) => elements("input[name=startsAt]")[index];

  const labelsOfAllOptions = (element) =>
    Array.from(element.childNodes, (node) => node.textContent);

  const findOption = (selectBox, textContent) => {
    const options = Array.from(selectBox.childNodes);
    return options.find((option) => option.textContent === textContent);
  };

  it("renders a from", () => {
    render(<AppointmentForm {...testProps} />);
    expect(form()).not.toBeNull();
  });

  it("renders a submit button", () => {
    render(<AppointmentForm {...testProps} />);
    expect(submitButton()).not.toBeNull();
  });

  it("prevents the default action when submitting the form", () => {
    render(<AppointmentForm {...testProps} onSubmit={() => {}} />);
    const event = submit(form());
    expect(event.defaultPrevented).toBe(true);
  });

  const itRendersAsASelectBox = (fieldName) => {
    it("renders as a select box", () => {
      render(<AppointmentForm {...testProps} />);
      expect(field(fieldName)).not.toBeNull();
      expect(field(fieldName)).toBeElementWithTag("select");
    });
  };

  const itHasABlankValueAsTheFirstValue = (fieldName) => {
    it("has a blank value as the first value", () => {
      render(<AppointmentForm {...testProps} original={blankAppointment} />);
      const firstOption = field(fieldName).childNodes[0];
      expect(firstOption.value).toEqual("");
    });
  };

  describe("service field", () => {
    itRendersAsASelectBox("service");
    itHasABlankValueAsTheFirstValue("service");

    it("lists all salon services", () => {
      const services = ["Cut", "Blow-dry"];
      render(<AppointmentForm {...testProps} selectableServices={services} />);
      expect(labelsOfAllOptions(field("service"))).toEqual(
        expect.arrayContaining(services)
      );
    });

    it("pre-selects the existing value", () => {
      const appointment = { service: "Blow-dry" };
      render(
        <AppointmentForm
          {...testProps}
          selectableServices={services}
          original={appointment}
        />
      );

      const option = findOption(field("service"), "Blow-dry");

      expect(option.selected).toBe(true);
    });

    it("renders a label for the service request", () => {
      render(<AppointmentForm {...testProps} />);
      expect(labelFor("service")).not.toBeNull();
    });

    it(`renders 'Salon service' as the service label content`, () => {
      render(<AppointmentForm {...testProps} />);
      expect(labelFor("service")).toContainText("Salon service");
    });

    it("assigns the id 'service' to match the label id", () => {
      render(<AppointmentForm {...testProps} />);
      expect(field("service").id).toEqual("service");
    });

    it("saves existing service when submitted", () => {
      expect.hasAssertions();
      const appointment = { service: "Blow-dry" };
      render(
        <AppointmentForm
          {...testProps}
          selectableServices={services}
          original={appointment}
          onSubmit={(props) =>
            expect(props["service"]).toEqual(appointment.service)
          }
        />
      );
      click(submitButton());
    });

    it("saves a new service when submitted", () => {
      expect.hasAssertions();
      const appointment = { service: "Blow-dry" };
      render(
        <AppointmentForm
          {...testProps}
          selectableServices={services}
          original={appointment}
          onSubmit={(props) => expect(props["service"]).toEqual("Cut")}
        />
      );
      change(field("service"), "Cut");
      click(submitButton());
    });
  });

  describe("stylist field", () => {
    itRendersAsASelectBox("stylist");
    itHasABlankValueAsTheFirstValue("stylist");
  });

  describe("time slot table", () => {
    it("renders a table for the time slots with an id", () => {
      render(<AppointmentForm {...testProps} />);
      expect(element("table#time-slots")).not.toBeNull();
    });

    it("renders a time slot for every half hour between open and close times", () => {
      render(
        <AppointmentForm {...testProps} salonOpensAt={9} salonClosesAt={11} />
      );
      const timesOfDayHeadings = elements("tbody >* th");
      expect(timesOfDayHeadings[0]).toContainText("09:00");
      expect(timesOfDayHeadings[1]).toContainText("09:30");
      expect(timesOfDayHeadings[3]).toContainText("10:30");
    });

    it("renders an empty cell at the start of the header row", () => {
      render(<AppointmentForm {...testProps} />);
      const headerRow = element("thead > tr");
      expect(headerRow.firstChild).toContainText("");
    });

    it("renders a week of available dates", () => {
      const specificDate = new Date(2023, 0, 1); // 1/1/23
      render(<AppointmentForm {...testProps} today={specificDate} />);
      const dates = elements("thead >* th:not(:first-child)");

      expect(dates).toHaveLength(7);
      expect(dates[0]).toContainText("Sun 01");
      expect(dates[1]).toContainText("Mon 02");
      expect(dates[6]).toContainText("Sat 07");
    });

    const cellsWithRadioButtons = () =>
      elements("input[type=radio]").map((el) =>
        elements("td").indexOf(el.parentNode)
      );

    it("renders radio buttons in the correct table cell positions", () => {
      const availableTimeSlots = [
        { startsAt: todayAt(9) },
        { startsAt: todayAt(9, 30) },
        { startsAt: tomorrowAt(9, 30) },
      ];

      render(
        <AppointmentForm
          {...testProps}
          availableTimeSlots={availableTimeSlots}
        />
      );
      expect(cellsWithRadioButtons()).toEqual([0, 7, 8]);
    });

    it("does not render radio buttons for unavailable time slots", () => {
      render(<AppointmentForm {...testProps} availableTimeSlots={[]} />);
      expect(elements("input[type=radio]")).toHaveLength(0);
    });

    it("sets radio button values to the startsAt value of the corresponding appointment", () => {
      render(
        <AppointmentForm
          {...testProps}
          availableTimeSlots={availableTimeSlots}
        />
      );
      const allRadioValues = elements("input[type=radio]").map(({ value }) =>
        parseInt(value)
      );
      const allSlotTimes = availableTimeSlots.map(({ startsAt }) => startsAt);
      expect(allRadioValues).toEqual(allSlotTimes);
    });

    it("pre-selects the existing value", () => {
      const appointment = { startsAt: availableTimeSlots[1].startsAt };
      render(
        <AppointmentForm
          {...testProps}
          original={appointment}
          availableTimeSlots={availableTimeSlots}
        />
      );
      expect(startsAtField(1).checked).toEqual(true);
    });

    it("saves existing value when submitted", () => {
      expect.hasAssertions();
      const appointment = {
        startsAt: availableTimeSlots[1].startsAt,
      };
      render(
        <AppointmentForm
          {...testProps}
          original={appointment}
          onSubmit={({ startsAt }) =>
            expect(startsAt).toEqual(availableTimeSlots[1].startsAt)
          }
        />
      );
      click(submitButton());
    });

    it("saves new value when submitted", () => {
      expect.hasAssertions();
      const appointment = {
        startsAt: availableTimeSlots[0].startsAt,
      };
      render(
        <AppointmentForm
          {...testProps}
          original={appointment}
          onSubmit={({ startsAt }) =>
            expect(startsAt).toEqual(availableTimeSlots[1].startsAt)
          }
        />
      );
      click(startsAtField(1));
      click(submitButton());
    });
  });
});
