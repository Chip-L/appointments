import React from "react";
import { Appointment, AppointmentsDayView } from "../src/AppointmentsDayView";
import { todayAt } from "./builders/time";
import {
  click,
  element,
  elements,
  initializeReactContainer,
  render,
  textOf,
  typesOf,
} from "./reactTestExtensions";

// interface ICustomer {
//   firstName: string;
//   lastName: string;
//   phoneNumber: string;
// }

// interface IAppointment  {
//   customer: ICustomer,
//   stylist: string,
//   service: "Cut" | "Blow-dry" | "Cut & color" | "Beard trim" | "Cut & beard trim" | "Extensions",
//   notes: string,
//   startsAt: String,
// }

describe("Appointment", () => {
  const blankCustomer = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };

  beforeEach(() => {
    initializeReactContainer();
  });

  it("renders a div with the right id", () => {
    render(<Appointment customer={blankCustomer} />);
    expect(element("div#appointmentView")).not.toBeNull();
  });

  describe("heading", () => {
    it("renders an h3 element", () => {
      render(<Appointment customer={blankCustomer} />);
      expect(element("h3")).not.toBeNull();
    });

    it("renders the time in the heading", () => {
      const startsAt = todayAt(12, 0);
      render(<Appointment customer={blankCustomer} startsAt={startsAt} />);
      expect(document.body).toContainText("Today's appointment at 12:00");
    });

    it("renders another time in the heading", () => {
      const startsAt = todayAt(13);
      render(<Appointment customer={blankCustomer} startsAt={startsAt} />);
      expect(document.body).toContainText("Today's appointment at 13:00");
    });
  });

  describe("Appointment View table", () => {
    const appointmentTable = () => element("#appointmentView > table");

    it("is rendered", () => {
      render(<Appointment customer={blankCustomer} />);

      expect(appointmentTable()).not.toBeNull();
    });

    // I'm not going to list each heading for the same reason that we don't do each of the buttons (Testing element positioning)

    it("renders the customer first name", () => {
      const customer = { firstName: "Ashley" };
      render(<Appointment customer={customer} />);
      expect(appointmentTable()).toContainText(customer.firstName);
    });

    it("renders another customer first name", () => {
      const customer = { firstName: "Jordan" };
      render(<Appointment customer={customer} />);
      expect(appointmentTable()).toContainText(customer.firstName);
    });

    it("renders the customer last name", () => {
      const customer = { lastName: "Smith" };
      render(<Appointment customer={customer} />);
      expect(appointmentTable()).toContainText(customer.lastName);
    });

    it("renders another customer last name", () => {
      const customer = { lastName: "Jones" };
      render(<Appointment customer={customer} />);
      expect(appointmentTable()).toContainText(customer.lastName);
    });

    it("renders the customer's phone number", () => {
      const customer = { phoneNumber: "1235551212" };
      render(<Appointment customer={customer} />);
      expect(appointmentTable()).toContainText("(123) 555-1212");
    });

    it("renders another customer's phone number", () => {
      const customer = { phoneNumber: "1235558998" };
      render(<Appointment customer={customer} />);
      expect(appointmentTable()).toContainText("(123) 555-8998");
    });

    it("renders the stylist's name", () => {
      const stylist = "Maggie";
      render(<Appointment customer={blankCustomer} stylist={stylist} />);
      expect(appointmentTable()).toContainText(stylist);
    });

    it("renders another stylist's name", () => {
      const stylist = "Jodie";
      render(<Appointment customer={blankCustomer} stylist={stylist} />);
      expect(appointmentTable()).toContainText(stylist);
    });

    it("renders the service", () => {
      const service = "Beard Trim";
      render(<Appointment customer={blankCustomer} service={service} />);
      expect(appointmentTable()).toContainText(service);
    });

    it("renders another service", () => {
      const service = "Cut";
      render(<Appointment customer={blankCustomer} service={service} />);
      expect(appointmentTable()).toContainText(service);
    });

    it("renders the notes", () => {
      const notes = "notes 1";
      render(<Appointment customer={blankCustomer} notes={notes} />);
      expect(appointmentTable()).toContainText(notes);
    });

    it("renders another notes", () => {
      const notes = "notes 2";
      render(<Appointment customer={blankCustomer} notes={notes} />);
      expect(appointmentTable()).toContainText(notes);
    });
  });
});

describe("AppointmentsDayView", () => {
  const twoAppointments = [
    {
      startsAt: todayAt(12),
      customer: { firstName: "Ashley" },
    },
    {
      startsAt: todayAt(13),
      customer: { firstName: "Jordan" },
    },
  ];

  const secondButton = () => elements("li > button")[1];

  beforeEach(() => {
    initializeReactContainer();
  });

  it("renders a div with the right id", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(element("div#appointmentsDayView")).not.toBeNull();
  });

  it("renders an ol element to display appointments", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(element("ol")).not.toBeNull();
  });

  it("renders an li element for each appointment", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    expect(elements("ol > li")).toHaveLength(2);
  });

  it("renders the time of each appointment", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    expect(textOf(elements("li"))).toEqual(["12:00", "13:00"]);
  });

  it("initially shows a message saying there are no appointments today", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(document.body).toContainText(
      "There are no appointments scheduled for today."
    );
  });

  it("selects the first appointment by default", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    expect(document.body).toContainText("Ashley");
  });

  it("has a button element in each li", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    expect(typesOf(elements("li > *"))).toEqual(["button", "button"]);
  });

  it("renders another appointment when clicked", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    click(secondButton());
    expect(document.body).toContainText("Jordan");
  });

  it("has toggled class when button is selected", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    click(secondButton());
    expect(secondButton()).toHaveClass("toggled");
  });

  it("does not have toggled class when button is not selected", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    expect(secondButton()).not.toHaveClass("toggled");
  });
});
