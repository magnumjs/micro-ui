/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core.js"; // adjust path
import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("createComponent new object signature", () => {
  let container;
  let parentHandler;
  let childHandler;
  let parentOnMount;
  let childOnMount;
  let parentOnUnmount;
  let childOnUnmount;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    parentHandler = jest.fn();
    childHandler = jest.fn();
    parentOnMount = jest.fn();
    childOnMount = jest.fn();
    parentOnUnmount = jest.fn();
    childOnUnmount = jest.fn();
  });

  afterEach(() => {
    container.remove();
  });

  test("mount, events, slots, and unmount work correctly", async () => {
    const childComp = createComponent({
      render: () => `<button data-action="childAction">Child</button>`,
      on: { "click button": childHandler },
      onMount: childOnMount,
      onUnmount: childOnUnmount,
    });

    const parentComp = createComponent({
      render: () => `<div>
          <button data-action="parentAction">Parent</button>
          <div id="child-slot"></div>
        </div>`,
      slots: { "child-slot": childComp },
      on: { "click button": parentHandler },
      onMount: parentOnMount,
      onUnmount: parentOnUnmount,
    });

    // Mount parent (also mounts child)
    parentComp.mount(container);

    // Lifecycle hooks called
    expect(parentOnMount).toHaveBeenCalledTimes(1);
    expect(childOnMount).toHaveBeenCalledTimes(1);

    // Event delegation
    const parentButton = container.querySelector("[data-action='parentAction']");
    const childButton = container.querySelector("[data-action='childAction']");

    parentButton.click();
    expect(parentHandler).toHaveBeenCalledTimes(1);
    expect(childHandler).not.toHaveBeenCalled();

    childButton.click();
    expect(childHandler).toHaveBeenCalledTimes(1);
    expect(parentHandler).toHaveBeenCalledTimes(2);

    // setState triggers rerender
    parentComp.setState({ name: "Test" });
    expect(container.innerHTML).toContain("Parent"); // basic check render still present

    // update with new props triggers onUpdate
    const parentOnUpdate = jest.fn();
    parentComp.update({ foo: "bar" });
    // Can't spy on the previous example, but we can ensure no errors occur

    // Unmount triggers onUnmount hooks
    parentComp.unmount();
    expect(parentOnUnmount).toHaveBeenCalledTimes(1);
    expect(childOnUnmount).toHaveBeenCalledTimes(2);

    // DOM removed
    expect(container.innerHTML).toBe("");
  });
});
