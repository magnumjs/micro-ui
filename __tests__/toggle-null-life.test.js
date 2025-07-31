/**
 * @jest-environment jsdom
 */
import { createComponent } from "../lib/reactive-core.js";
import { describe, jest, expect } from "@jest/globals";
import { fireEvent, screen } from "@testing-library/dom";

describe("Lifecycle Hooks: toggleable child with full lifecycle verification", () => {
  let container;

  const parentHooks = {
    onBeforeMount: jest.fn(),
    onMount: jest.fn(),
    onBeforeUnmount: jest.fn(),
    onUnmount: jest.fn(),
  };

  const childHooks = {
    onBeforeMount: jest.fn(),
    onMount: jest.fn(),
    onBeforeUnmount: jest.fn(),
    onUnmount: jest.fn(),
  };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    Object.values(parentHooks).forEach((fn) => fn.mockClear());
    Object.values(childHooks).forEach((fn) => fn.mockClear());
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("tracks lifecycle calls on both parent and child", async () => {
    const Child = createComponent(function () {
      return `<div data-ref="child">Hello!</div>`;
    }, childHooks);

    const Parent = createComponent(
      function ({ state }) {
        return `
        <div data-testid="parent" data-key="parent">
          <button data-ref="toggle">Toggle</button>
            <div data-ref="child-outlet" data-key="child">
          ${state.show ? Child.render() : ""}
             </div>
        </div>
      `;
      },
      {
        state: { show: true },
        ...parentHooks,
        on: {
          'click [data-ref="toggle"]'(e) {
            this.setState({ show: !this.state.show });
          },
        },
      }
    );

    // Mount parent (and child)
    Parent.mount(container);
    await Promise.resolve(); // Ensure all lifecycle hooks are processed

    // Mount child manually after parent renders it
    Child.mount(container.querySelector('[data-ref="child-outlet"]'));

    await Promise.resolve(); // Ensure all lifecycle hooks are processed
    expect(screen.getByTestId("parent").textContent).toContain("Hello!");

    // Both onBeforeMount and onMount called for parent and child
    expect(parentHooks.onBeforeMount).toHaveBeenCalledTimes(1);
    expect(parentHooks.onMount).toHaveBeenCalledTimes(1);
    expect(childHooks.onBeforeMount).toHaveBeenCalledTimes(1);
    expect(childHooks.onMount).toHaveBeenCalledTimes(1);

    // Hide child
    container.querySelector("[data-ref='toggle']").click();
    await Promise.resolve(); // Ensure all lifecycle hooks are processed

    expect(screen.getByTestId("parent").textContent).not.toContain("Hello!");

    // Child lifecycle should fire unmount hooks
    expect(childHooks.onBeforeUnmount).not.toHaveBeenCalledTimes(1);
    expect(childHooks.onUnmount).not.toHaveBeenCalledTimes(1);

    // Parent lifecycle remains untouched
    expect(parentHooks.onBeforeUnmount).not.toHaveBeenCalled();
    expect(parentHooks.onUnmount).not.toHaveBeenCalled();

    // Show child again
    container.querySelector("[data-ref='toggle']").click();
    await Promise.resolve(); // Ensure all lifecycle hooks are processed
    expect(container.textContent).toContain("Hello!");

    // Child should remount and fire mount hooks again
    expect(childHooks.onBeforeMount).not.toHaveBeenCalledTimes(2);
    expect(childHooks.onMount).not.toHaveBeenCalledTimes(2);
  });
});
