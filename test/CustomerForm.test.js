import React from "react";
import {
  change,
  clickAndWait,
  element,
  field,
  form,
  initializeReactContainer,
  labelFor,
  render,
  submitAndWait,
  submitButton,
} from "./reactTestExtensions";
import { CustomerForm } from "../src/CustomerForm";

const spy = () => {
  let receivedArguments;
  let returnValue;
  return {
    fn: (...args) => {
      receivedArguments = args;
      return returnValue;
    },
    receivedArguments: () => receivedArguments,
    receivedArgument: (n) => receivedArguments[n],
    stubReturnValue: (value) => (returnValue = value),
  };
};

const fetchResponseOk = (body) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  });

const fetchResponseError = () => Promise.resolve({ ok: false });

describe("CustomerForm", () => {
  const originalFetch = global.fetch;
  let fetchSpy;

  const bodyOfLastFetchRequest = () =>
    JSON.parse(fetchSpy.receivedArgument(1).body);

  const blankCustomer = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };

  beforeEach(() => {
    // console.log(expect.getState().currentTestName);
    initializeReactContainer();
    fetchSpy = spy();
    global.fetch = fetchSpy.fn;
    fetchSpy.stubReturnValue(fetchResponseOk({}));
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

  it("prevents the default action when submitting the form", async () => {
    render(<CustomerForm original={blankCustomer} onSave={() => {}} />);
    const event = await submitAndWait(form());
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
    it("saves existing value when submitted", async () => {
      const customer = { [fieldName]: value };
      render(<CustomerForm original={customer} onSave={() => {}} />);
      await clickAndWait(submitButton());
      expect(bodyOfLastFetchRequest()).toMatchObject(customer);
    });
  };

  const itSubmitsNewValue = (fieldName, value) =>
    it("saves new value when submitted", async () => {
      render(<CustomerForm original={blankCustomer} onSave={() => {}} />);
      change(field(fieldName), value);
      await clickAndWait(submitButton());
      expect(bodyOfLastFetchRequest()).toMatchObject({
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

  it("sends request to POST /customers when submitting the form", async () => {
    render(<CustomerForm original={blankCustomer} onSave={() => {}} />);
    await clickAndWait(submitButton());
    expect(fetchSpy).toBeCalledWith(
      "/customers",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  it("calls fetch with the right configuration", async () => {
    render(<CustomerForm original={blankCustomer} onSave={() => {}} />);
    await clickAndWait(submitButton());
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

  it("notifies onSave when form is submitted", async () => {
    const customer = { id: 123 };
    fetchSpy.stubReturnValue(fetchResponseOk(customer));
    const saveSpy = spy();

    render(<CustomerForm original={customer} onSave={saveSpy.fn} />);
    await clickAndWait(submitButton());

    expect(saveSpy).toBeCalledWith(customer);
  });

  it("does not notify onSave if the POST request returns an error", async () => {
    fetchSpy.stubReturnValue(fetchResponseError());
    const saveSpy = spy();

    render(<CustomerForm original={blankCustomer} onSave={saveSpy.fn} />);
    await clickAndWait(submitButton());

    expect(saveSpy).not.toBeCalledWith();
  });

  it("renders an alert space", async () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(element("[role=alert]")).not.toBeNull();
  });

  it("renders error message when fetch call fails", async () => {
    fetchSpy.stubReturnValue(fetchResponseError());
    render(<CustomerForm original={blankCustomer} />);
    await clickAndWait(submitButton());

    expect(element("[role=alert]")).toContainText("error occurred");
  });
});
