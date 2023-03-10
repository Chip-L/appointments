import React, { useState } from "react";

export const CustomerForm = ({ original, onSave }) => {
  const [customer, setCustomer] = useState(original);
  const [error, setError] = useState(false);

  const handleChange = ({ target }) =>
    setCustomer((customer) => ({
      ...customer,
      [target.name]: target.value,
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await global.fetch("/customers", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });
    if (result.ok) {
      const customerWithId = await result.json();
      onSave(customerWithId);
      setError(false);
    } else {
      setError(true);
    }
  };
  const Error = ({ hasError }) => (
    <p role="alert">{hasError ? "An error occurred during save." : ""}</p>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Error hasError={error} />
      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        name="firstName"
        id="firstName"
        value={customer.firstName}
        onChange={handleChange}
      />
      <label htmlFor="lastName">Last Name</label>
      <input
        type="text"
        name="lastName"
        id="lastName"
        value={customer.lastName}
        onChange={handleChange}
      />
      <label htmlFor="phoneNumber">Phone Number</label>
      <input
        type="text"
        name="phoneNumber"
        id="phoneNumber"
        value={customer.phoneNumber}
        onChange={handleChange}
      />
      <input type="submit" value="Add" />
    </form>
  );
};
