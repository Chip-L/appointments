import { toBeElementWithTag } from "./matchers/toBeElementWithTag";
import { toContainText } from "./matchers/toContainText";
import { toHaveClass } from "./matchers/toHaveClass";
import { toBeInputFieldOfType } from "./matchers/toBeInputFieldOfType";
import { toBeRenderedWithProps } from "./matchers/toBeRenderedWithProps";

expect.extend({
  toBeElementWithTag,
  toBeInputFieldOfType,
  toContainText,
  toHaveClass,
  toBeRenderedWithProps,
});
