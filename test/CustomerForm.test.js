import React from "react";
import {
  change,
  click,
  field,
  form,
  initializeReactContainer,
  labelFor,
  render,
  submit,
  submitButton,
} from "./reactTestExtensions";
import { CustomerForm } from "../src/CustomerForm";

const spy = () => {
  let receivedArguments;
  return {
    fn: (...args) => (receivedArguments = args),
    receivedArguments: () => receivedArguments,
    receivedArgument: (n) => receivedArguments[n],
  };
};

describe("CustomerForm", () => {
  const originalFetch = global.fetch;
  let fetchSpy;

  const blankCustomer = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };

  beforeEach(() => {
    initializeReactContainer();
    fetchSpy = spy();
    global.fetch = fetchSpy.fn;
  });
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("renders a form", () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(form()).not.toBeNull();
  });

  it("renders a submit button", () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(submitButton()).not.toBeNull();
  });

  it("prevents the default action when submitting the form", () => {
    render(<CustomerForm original={blankCustomer} onSubmit={() => {}} />);
    const event = submit(form());
    expect(event.defaultPrevented).toBe(true);
  });

  const itRendersAsATextBox = (fieldName) => {
    it("renders as a text box", () => {
      render(<CustomerForm original={blankCustomer} />);
      expect(field(fieldName)).toBeInputFieldOfType("text");
    });
  };

  const itIncludesTheExistingValue = (fieldName, existing) => {
    it("includes the existing value", () => {
      const customer = { [fieldName]: existing };
      render(<CustomerForm original={customer} />);
      expect(field(fieldName).value).toEqual(existing);
    });
  };

  const itRendersALabel = (fieldName, text) => {
    it("renders a label", () => {
      render(<CustomerForm original={blankCustomer} />);
      expect(labelFor(fieldName)).not.toBeNull();
    });

    it(`renders '${text}' as the label's content`, () => {
      render(<CustomerForm original={blankCustomer} />);
      expect(labelFor(fieldName)).toContainText(text);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) => {
    it("assigns an id that matches the label id", () => {
      render(<CustomerForm original={blankCustomer} />);
      expect(field(fieldName).id).toEqual(fieldName);
    });
  };

  const itSubmitsExistingValue = (fieldName, value) => {
    it("saves existing value when submitted", () => {
      const submitSpy = spy();
      const customer = { [fieldName]: value };
      render(<CustomerForm original={customer} onSubmit={submitSpy.fn} />);
      click(submitButton());

      expect(submitSpy).toBeCalledWith(customer);
    });
  };

  const itSubmitsNewValue = (fieldName, value) =>
    it("saves new value when submitted", () => {
      const submitSpy = spy();
      render(<CustomerForm original={blankCustomer} onSubmit={submitSpy.fn} />);
      change(field(fieldName), value);
      click(submitButton());

      expect(submitSpy).toBeCalledWith({
        ...blankCustomer,
        [fieldName]: value,
      });
    });

  describe("first name field", () => {
    itRendersAsATextBox("firstName");
    itIncludesTheExistingValue("firstName", "Ashley");
    itRendersALabel("firstName", "First Name");
    itAssignsAnIdThatMatchesTheLabelId("firstName");
    itSubmitsExistingValue("firstName", "Ashley");
    itSubmitsNewValue("firstName", "newValue");
  });

  describe("last name field", () => {
    itRendersAsATextBox("lastName");
    itIncludesTheExistingValue("lastName", "existingValue");
    itRendersALabel("lastName", "Last Name");
    itAssignsAnIdThatMatchesTheLabelId("lastName");
    itSubmitsExistingValue("lastName", "existingValue");
    itSubmitsNewValue("lastName", "newValue");
  });

  describe("Phone number field", () => {
    itRendersAsATextBox("phoneNumber");
    itIncludesTheExistingValue("phoneNumber", "existingValue");
    itRendersALabel("phoneNumber", "Phone Number");
    itAssignsAnIdThatMatchesTheLabelId("phoneNumber");
    itSubmitsExistingValue("phoneNumber", "existingValue");
    itSubmitsNewValue("phoneNumber", "newValue");
  });

  it("sends request to POST /customers when submitting the form", () => {
    render(<CustomerForm original={blankCustomer} onSubmit={() => {}} />);
    click(submitButton());
    expect(fetchSpy).toBeCalledWith(
      "/customers",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("calls fetch with the correct configuration", () => {
    render(<CustomerForm original={blankCustomer} onSubmit={() => {}} />);
    click(submitButton());
    expect(fetchSpy).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  });
});
