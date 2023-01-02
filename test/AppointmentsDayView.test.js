import React from "react";
import ReactDOM from "react-dom/client";
import { act } from "react-dom/test-utils";
import { Appointment, AppointmentsDayView } from "../src/AppointmentsDayView";

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
  let container;
  const blankCustomer = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };

  const render = (component) =>
    act(() => {
      ReactDOM.createRoot(container).render(component);
    });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.replaceChildren(container);
  });

  it("renders a div with the right id", () => {
    render(<Appointment customer={blankCustomer} />);

    expect(document.querySelector("div#appointmentView")).not.toBeNull();
  });

  describe("heading", () => {
    it("renders an h3 element", () => {
      render(<Appointment customer={blankCustomer} />);
      expect(document.querySelector("h3")).not.toBeNull();
    });

    it("renders the time in the heading", () => {
      const startsAt = new Date().setHours(12, 0);
      render(<Appointment customer={blankCustomer} startsAt={startsAt} />);
      expect(document.body.textContent).toContain(
        "Today's appointment at 12:00"
      );
    });

    it("renders another time in the heading", () => {
      const startsAt = new Date().setHours(13, 0);
      render(<Appointment customer={blankCustomer} startsAt={startsAt} />);
      expect(document.body.textContent).toContain(
        "Today's appointment at 13:00"
      );
    });
  });

  describe("Appointment View table", () => {
    const appointmentTable = () =>
      document.querySelector("#appointmentView > table");

    it("is rendered", () => {
      render(<Appointment customer={blankCustomer} />);

      expect(appointmentTable()).not.toBeNull();
    });

    // I'm not going to list each heading for the same reason that we don't do each of the buttons (Testing element positioning)

    it("renders the customer first name", () => {
      const customer = { firstName: "Ashley" };
      render(<Appointment customer={customer} />);
      expect(appointmentTable().textContent).toContain(customer.firstName);
    });

    it("renders another customer first name", () => {
      const customer = { firstName: "Jordan" };
      render(<Appointment customer={customer} />);
      expect(appointmentTable().textContent).toContain(customer.firstName);
    });

    it("renders the customer last name", () => {
      const customer = { lastName: "Smith" };
      render(<Appointment customer={customer} />);
      expect(appointmentTable().textContent).toContain(customer.lastName);
    });

    it("renders another customer last name", () => {
      const customer = { lastName: "Jones" };
      render(<Appointment customer={customer} />);
      expect(appointmentTable().textContent).toContain(customer.lastName);
    });

    it("renders the customer's phone number", () => {
      const customer = { phoneNumber: "1235551212" };
      render(<Appointment customer={customer} />);
      expect(appointmentTable().textContent).toContain("(123) 555-1212");
    });

    it("renders another customer's phone number", () => {
      const customer = { phoneNumber: "1235558998" };
      render(<Appointment customer={customer} />);
      expect(appointmentTable().textContent).toContain("(123) 555-8998");
    });

    it("renders the stylist's name", () => {
      const stylist = "Maggie";
      render(<Appointment customer={blankCustomer} stylist={stylist} />);
      expect(appointmentTable().textContent).toContain("Maggie");
    });

    it("renders another stylist's name", () => {
      const stylist = "Jodie";
      render(<Appointment customer={blankCustomer} stylist={stylist} />);
      expect(appointmentTable().textContent).toContain("Jodie");
    });

    it("renders the service", () => {
      const service = "Beard Trim";
      render(<Appointment customer={blankCustomer} service={service} />);
      expect(appointmentTable().textContent).toContain("Beard Trim");
    });

    it("renders another service", () => {
      const service = "Cut";
      render(<Appointment customer={blankCustomer} service={service} />);
      expect(appointmentTable().textContent).toContain("Cut");
    });

    it("renders the notes", () => {
      const notes = "notes 1";
      render(<Appointment customer={blankCustomer} notes={notes} />);
      expect(appointmentTable().textContent).toContain("notes 1");
    });

    it("renders another notes", () => {
      const notes = "notes 2";
      render(<Appointment customer={blankCustomer} notes={notes} />);
      expect(appointmentTable().textContent).toContain("notes 2");
    });
  });
});

describe("AppointmentsDayView", () => {
  let container;
  const today = new Date();
  const twoAppointments = [
    {
      startsAt: today.setHours(12, 0),
      customer: { firstName: "Ashley" },
    },
    {
      startsAt: today.setHours(13, 0),
      customer: { firstName: "Jordan" },
    },
  ];

  const render = (component) =>
    act(() => {
      ReactDOM.createRoot(container).render(component);
    });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.replaceChildren(container);
  });

  it("renders a div with the right id", () => {
    render(<AppointmentsDayView appointments={[]} />);

    expect(document.querySelector("div#appointmentsDayView")).not.toBeNull();
  });

  it("renders an ol element to display appointments", () => {
    render(<AppointmentsDayView appointments={[]} />);

    const listElement = document.querySelector("ol");

    expect(listElement).not.toBeNull();
  });

  it("renders an li element for each appointment", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);

    const listChildren = document.querySelectorAll("ol > li");

    expect(listChildren).toHaveLength(2);
  });

  it("renders the time of each appointment", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);

    const listChildren = document.querySelectorAll("li");

    expect(listChildren[0].textContent).toEqual("12:00");
    expect(listChildren[1].textContent).toEqual("13:00");
  });

  it("initially shows a message saying there are no appointments today", () => {
    render(<AppointmentsDayView appointments={[]} />);

    const text = document.body.textContent;

    expect(text).toContain("There are no appointments scheduled for today.");
  });

  it("selects the first appointment by default", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);

    const text = document.body.textContent;

    expect(text).toContain("Ashley");
  });

  it("has a button element in each li", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);

    const buttons = document.querySelectorAll("li > button");

    expect(buttons).toHaveLength(2);
    expect(buttons[0].type).toEqual("button");
  });

  it("renders another appointment when clicked", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);

    const button = document.querySelectorAll("li > button")[1];
    act(() => button.click());

    expect(document.body.textContent).toContain("Jordan");
  });
});
