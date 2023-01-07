export const toBeElementWithTag = (received, expected) => {
  expected = expected.toUpperCase();
  const pass = received?.tagName === expected;

  return { pass };
};
