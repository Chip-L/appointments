import React from "react";
import { AppointmentForm } from "../src/AppointmentForm";
import { blankAppointment } from "./builders/appointment";
import { fetchResponseError, fetchResponseOk } from "./builders/fetch";
import { today, todayAt, tomorrowAt } from "./builders/time";
import {
  change,
  clickAndWait,
  element,
  elements,
  field,
  form,
  initializeReactContainer,
  labelFor,
  render,
  submitAndWait,
  submitButton,
} from "./reactTestExtensions";
import { bodyOfLastFetchRequest } from "./spyHelpers";

describe("AppointmentForm", () => {
  const availableTimeSlots = [
    {
      startsAt: todayAt(9),
      stylists: ["Ashley", "Jo"],
    },
    {
      startsAt: todayAt(9, 30),
      stylists: ["Ashley"],
    },
  ];

  const services = ["Cut", "Blow-dry"];
  const stylists = ["Ashley", "Jo"];

  const testProps = {
    today,
    selectableServices: services,
    selectableStylists: stylists,
    availableTimeSlots,
    original: blankAppointment,
  };

  beforeEach(() => {
    initializeReactContainer();
    jest.spyOn(global, "fetch").mockResolvedValue(fetchResponseOk);
  });

  const startsAtField = (index) => elements("input[name=startsAt]")[index];

  const labelsOfAllOptions = (element) =>
    Array.from(element.childNodes, (node) => node.textContent);

  const findOption = (selectBox, textContent) => {
    const options = Array.from(selectBox.childNodes);
    return options.find((option) => option.textContent === textContent);
  };

  it("renders a form", () => {
    render(<AppointmentForm {...testProps} />);
    expect(form()).not.toBeNull();
  });

  it("renders a submit button", () => {
    render(<AppointmentForm {...testProps} />);
    expect(submitButton()).not.toBeNull();
  });

  it("prevents the default action when submitting the form", async () => {
    render(<AppointmentForm {...testProps} onSave={() => {}} />);
    const event = await submitAndWait(form());
    expect(event.defaultPrevented).toBe(true);
  });

  it("calls fetch with the properties when submitting data", async () => {
    render(<AppointmentForm {...testProps} onSave={() => {}} />);
    await clickAndWait(submitButton());
    expect(global.fetch).toBeCalledWith(
      "/appointments",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  });

  it("notifies onSave when form is submitted", async () => {
    global.fetch.mockResolvedValue(fetchResponseOk({}));
    const saveSpy = jest.fn();

    render(<AppointmentForm {...testProps} onSave={saveSpy} />);
    await clickAndWait(submitButton());

    expect(saveSpy).toBeCalled();
  });

  it("does not notify onSave if the POST request returns an error", async () => {
    global.fetch.mockResolvedValue(fetchResponseError());
    const saveSpy = jest.fn();
    render(<AppointmentForm {...testProps} onSave={saveSpy} />);
    await clickAndWait(submitButton());

    expect(saveSpy).not.toBeCalledWith();
  });

  it("renders an alert space", async () => {
    render(<AppointmentForm {...testProps} />);
    expect(element("[role=alert]")).not.toBeNull();
  });

  it("renders error message if fetch call fails", async () => {
    global.fetch.mockResolvedValue(fetchResponseError());
    render(<AppointmentForm {...testProps} />);
    await clickAndWait(submitButton());

    expect(element("[role=alert]")).toContainText("error occurred");
  });

  it("initially has no text in the alert space", async () => {
    render(<AppointmentForm {...testProps} />);
    expect(element("[role=alert]")).not.toContainText("error occurred");
  });

  it("clears the alert after a second successful submit", async () => {
    global.fetch
      .mockResolvedValueOnce(fetchResponseError)
      .mockResolvedValue(fetchResponseOk());
    const saveSpy = jest.fn();

    render(<AppointmentForm {...testProps} onSave={saveSpy} />);
    await clickAndWait(submitButton());
    await clickAndWait(submitButton());

    expect(element("[role=alert]")).not.toContainText("error occurred");
  });

  it("passes the customer id to fetch when submitting", async () => {
    const appointment = {
      ...blankAppointment,
      customer: 123,
    };
    render(<AppointmentForm {...testProps} original={appointment} />);
    await clickAndWait(submitButton());
    expect(bodyOfLastFetchRequest()).toMatchObject({ customer: 123 });
  });

  const itRendersAsASelectBox = (fieldName) => {
    it("renders as a select box", () => {
      render(<AppointmentForm {...testProps} />);
      expect(field(fieldName)).not.toBeNull();
      expect(field(fieldName)).toBeElementWithTag("select");
    });
  };

  const itInitiallyHasABlankValueChosen = (fieldName) => {
    it("has a blank value as the first value", () => {
      render(<AppointmentForm {...testProps} original={blankAppointment} />);
      const firstOption = field(fieldName).childNodes[0];
      expect(firstOption.value).toEqual("");
    });
  };

  const itPreSelectsExistingValue = (fieldName, existing) => {
    it("pre-selects the existing value", () => {
      const appointment = { [fieldName]: existing };
      render(<AppointmentForm {...testProps} original={appointment} />);
      const option = findOption(field(fieldName), existing);
      expect(option.selected).toBe(true);
    });
  };

  const itRendersALabel = (fieldName, text) => {
    it("renders a label for the field", () => {
      render(<AppointmentForm {...testProps} />);
      expect(labelFor(fieldName)).not.toBeNull();
    });

    it(`render '${text}' as the label content`, () => {
      render(<AppointmentForm {...testProps} />);
      expect(labelFor(fieldName)).toContainText(text);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) => {
    it("assigns an id that matches the label id", () => {
      render(<AppointmentForm {...testProps} />);
      expect(field(fieldName).id).toEqual(fieldName);
    });
  };

  const itSubmitsExistingValue = (fieldName, existing) => {
    it("saves existing value when submitted", async () => {
      const appointment = { [fieldName]: existing };
      render(
        <AppointmentForm
          {...testProps}
          original={appointment}
          onSave={() => {}}
        />
      );
      await clickAndWait(submitButton());
      clickAndWait(submitButton());

      expect(bodyOfLastFetchRequest()).toMatchObject(appointment);
    });
  };

  const itSubmitsNewValue = (fieldName, newValue) => {
    it("saves a new value when submitted", async () => {
      render(<AppointmentForm {...testProps} onSave={() => {}} />);
      change(field(fieldName), newValue);
      await clickAndWait(submitButton());

      expect(bodyOfLastFetchRequest()).toMatchObject({ [fieldName]: newValue });
    });
  };

  describe("service field", () => {
    itRendersAsASelectBox("service");
    itInitiallyHasABlankValueChosen("service");
    itPreSelectsExistingValue("service", "Cut");
    itRendersALabel("service", "Salon service");
    itAssignsAnIdThatMatchesTheLabelId("service");
    itSubmitsExistingValue("service", "Cut");
    itSubmitsNewValue("service", "Blow-dry");

    it("lists all salon services", () => {
      render(<AppointmentForm {...testProps} selectableServices={services} />);
      expect(labelsOfAllOptions(field("service"))).toEqual(
        expect.arrayContaining(services)
      );
    });
  });

  describe("stylist field", () => {
    itRendersAsASelectBox("stylist");
    itInitiallyHasABlankValueChosen("stylist");
    itPreSelectsExistingValue("stylist", "Jo");
    itRendersALabel("stylist", "Stylist");
    itAssignsAnIdThatMatchesTheLabelId("stylist");
    itSubmitsExistingValue("stylist", "Jo");
    itSubmitsNewValue("stylist", "Jo");

    it("lists only stylists that can perform the selected service", () => {
      const selectableServices = ["1", "2"];
      const selectableStylists = ["A", "B", "C"];
      const serviceStylists = {
        1: ["A", "B"],
      };

      const appointment = { service: "1" };

      render(
        <AppointmentForm
          {...testProps}
          original={appointment}
          selectableServices={selectableServices}
          selectableStylists={selectableStylists}
          serviceStylists={serviceStylists}
        />
      );

      expect(labelsOfAllOptions(field("stylist"))).toEqual(
        expect.arrayContaining(["A", "B"])
      );
    });
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
        {
          startsAt: todayAt(9),
          stylists: ["Ashley"],
        },
        {
          startsAt: todayAt(9, 30),
          stylists: ["Ashley"],
        },
        {
          startsAt: tomorrowAt(9, 30),
          stylists: ["Ashley"],
        },
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
      const appointment = {
        startsAt: availableTimeSlots[1].startsAt,
      };
      render(
        <AppointmentForm
          {...testProps}
          original={appointment}
          availableTimeSlots={availableTimeSlots}
        />
      );
      expect(startsAtField(1).checked).toEqual(true);
    });

    it("saves existing value when submitted", async () => {
      const appointment = {
        startsAt: availableTimeSlots[1].startsAt,
      };
      render(
        <AppointmentForm
          {...testProps}
          original={appointment}
          onSave={() => {}}
        />
      );
      await clickAndWait(submitButton());

      expect(bodyOfLastFetchRequest()).toMatchObject(appointment);
    });

    it("saves new value when submitted", async () => {
      const appointment = {
        startsAt: availableTimeSlots[0].startsAt,
      };
      render(
        <AppointmentForm
          {...testProps}
          original={appointment}
          onSave={() => {}}
        />
      );

      await clickAndWait(startsAtField(1));
      await clickAndWait(submitButton());

      expect(bodyOfLastFetchRequest()).toMatchObject({
        startsAt: availableTimeSlots[1].startsAt,
      });
    });

    it("filters appointments by selected stylist", () => {
      const availableTimeSlots = [
        {
          startsAt: todayAt(9),
          stylists: ["Ashley"],
        },
        {
          startsAt: todayAt(9, 30),
          stylists: ["Jo"],
        },
      ];

      render(
        <AppointmentForm
          {...testProps}
          availableTimeSlots={availableTimeSlots}
        />
      );

      change(field("stylist"), "Jo");

      expect(cellsWithRadioButtons()).toEqual([7]);
    });
  });
});
