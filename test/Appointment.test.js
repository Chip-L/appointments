const React = require("react");
const ReactDOM = require("react-dom/client");
const { act } = require("react-dom/test-utils");
const { Appointment } = require("../src/Appointment");

describe("Appointment", () => {
  it("renders the customer first name", () => {
    const customer = { firstName: "Ashley" };
    const component = <Appointment customer={customer} />;
    const container = document.createElement("div");
    act(() => {
      ReactDOM.createRoot(document.body.appendChild(container)).render(
        component
      );
    });

    expect(document.body.textContent).toContain("Ashley");
  });
});
