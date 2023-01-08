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
import { bodyOfLastFetchRequest } from "./spyHelpers";
import { fetchResponseError, fetchResponseOk } from "./builders/fetch";

describe("CustomerForm", () => {
  const blankCustomer = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };

  beforeEach(() => {
    // console.log(expect.getState().currentTestName);
    initializeReactContainer();
    jest.spyOn(global, "fetch").mockResolvedValue(fetchResponseOk({}));
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

  const itSubmitsNewValue = (fieldName, value) => {
    it("saves new value when submitted", async () => {
      render(<CustomerForm original={blankCustomer} onSave={() => {}} />);
      change(field(fieldName), value);
      await clickAndWait(submitButton());
      expect(bodyOfLastFetchRequest()).toMatchObject({
        ...blankCustomer,
        [fieldName]: value,
      });
    });
  };

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
    expect(global.fetch).toBeCalledWith(
      "/customers",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  it("calls fetch with the right configuration", async () => {
    render(<CustomerForm original={blankCustomer} onSave={() => {}} />);
    await clickAndWait(submitButton());
    expect(global.fetch).toBeCalledWith(
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
    global.fetch.mockResolvedValue(fetchResponseOk(customer));
    const saveSpy = jest.fn();

    render(<CustomerForm original={customer} onSave={saveSpy} />);
    await clickAndWait(submitButton());

    expect(saveSpy).toBeCalledWith(customer);
  });

  describe("when POST request returns an error", () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue(fetchResponseError());
    });

    it("does not notify onSave", async () => {
      const saveSpy = jest.fn();
      render(<CustomerForm original={blankCustomer} onSave={saveSpy} />);
      await clickAndWait(submitButton());

      expect(saveSpy).not.toBeCalledWith();
    });

    it("renders error message", async () => {
      render(<CustomerForm original={blankCustomer} />);
      await clickAndWait(submitButton());

      expect(element("[role=alert]")).toContainText("error occurred");
    });
  });

  it("renders an alert space", async () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(element("[role=alert]")).not.toBeNull();
  });

  it("initially has no text in the alert space", async () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(element("[role=alert]")).not.toContainText("error occurred");
  });

  it("clears the alert after a second successful submit", async () => {
    global.fetch
      .mockResolvedValueOnce(fetchResponseError)
      .mockResolvedValue(fetchResponseOk());

    const saveSpy = jest.fn();
    render(<CustomerForm original={blankCustomer} onSave={saveSpy} />);
    await clickAndWait(submitButton());
    await clickAndWait(submitButton());

    expect(element("[role=alert]")).not.toContainText("error occurred");
  });
});
