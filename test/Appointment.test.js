const React = require("react");
const ReactDOM = require("react-dom/client");
const { act } = require("react-dom/test-utils");
const { Appointment } = require("../src/Appointment");

describe("Appointment", () => {
  it("renders the customer first name", () => {
    const customer = { firstName: "Ashley" };
    const component = <Appointment customer={customer} />;
    const container = document.createElement("div");

    document.body.replaceChildren(container);
    act(() => {
      ReactDOM.createRoot(container).render(component);
    });

    expect(document.body.textContent).toContain(customer.firstName);
  });

  it("renders another customer first name", () => {
    const customer = { firstName: "Jordan" };
    const component = <Appointment customer={customer} />;
    const container = document.createElement("div");

    document.body.replaceChildren(container);
    act(() => {
      ReactDOM.createRoot(container).render(component);
    });

    expect(document.body.textContent).toContain(customer.firstName);
  });
});
