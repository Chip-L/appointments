import { toBeElementWithTag } from "./matchers/toBeElementWithTag";
import { toContainText } from "./matchers/toContainText";
import { toHaveClass } from "./matchers/toHaveClass";
import { toBeInputFieldOfType } from "./matchers/toBeInputFieldOfType";
import {
  toBeRenderedFirstWithProps,
  toBeRenderedWithProps,
} from "./matchers/toBeRenderedWithProps";
import { toBeRendered } from "./matchers/toBeRendered";

expect.extend({
  toBeElementWithTag,
  toBeInputFieldOfType,
  toBeRendered,
  toBeRenderedFirstWithProps,
  toBeRenderedWithProps,
  toContainText,
  toHaveClass,
});
