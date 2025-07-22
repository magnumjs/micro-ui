/**
 * @jest-environment jsdom
 */
import { createComponent } from "../lib/reactive-core.js";
import { fireEvent, screen } from '@testing-library/dom';
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe("CounterWithToggle null return unmount/remount with DOM caching", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    container = null;
  });

  test("reuses cached DOM on remount and verifies refs, events, and lifecycle", async () => {
    const lifecycle = {
      onMount: jest.fn(),
      onBeforeUnmount: jest.fn(),
      onUnmount: jest.fn(),
    };

    const CounterWithToggle = createComponent(function ({ state, setState, refs }) {
      if (!state.show) return null;
      return `
        <div data-ref="box">
          Counter is visible
          <button data-ref="btn" data-testid="toggle-btn">Click me</button>
        </div>
      `;
    }, lifecycle);

    // Initial mount (state.show = undefined / false)
    CounterWithToggle.setState({ show: true });
    CounterWithToggle.mount(container);

    // Show counter

    // Allow any pending microtasks
    await Promise.resolve();

    // First mount assertions
    expect(lifecycle.onMount).toHaveBeenCalledTimes(1);
    const firstNode = container.firstChild;
    expect(firstNode?.textContent).toContain("Counter is visible");

    // Verify refs after mount
    expect(CounterWithToggle.refs.box).toBeDefined();
    expect(CounterWithToggle.refs.btn).toBeDefined();

    // Verify event handler can be bound and fired
    let clicked = false;
    CounterWithToggle.update({
      on: {
        'click [data-testid="toggle-btn"]': () => {
          clicked = true;
        },
      },
    });

    fireEvent.click(screen.getByTestId("toggle-btn"));
    expect(clicked).toBe(true);

    // Trigger unmount by hiding the component
    CounterWithToggle.setState({ show: false });
    await Promise.resolve();

    expect(lifecycle.onBeforeUnmount).toHaveBeenCalledTimes(1);
    expect(lifecycle.onUnmount).toHaveBeenCalledTimes(1);
    expect(container.innerHTML).toBe("");

    // Reset clicked for remount test
    clicked = false;

    // Trigger remount by showing again
    CounterWithToggle.setState({ show: true });
    await Promise.resolve();

    // onMount called second time after remount
    expect(lifecycle.onMount).toHaveBeenCalledTimes(2);

    const secondNode = container.firstChild;
    expect(secondNode?.textContent).toContain("Counter is visible");

    // Refs should be updated and valid
    expect(CounterWithToggle.refs.box).toBeDefined();
    expect(CounterWithToggle.refs.btn).toBeDefined();

    // The DOM node should be reused (same reference)
    expect(secondNode).toStrictEqual(firstNode);

    // Event should still fire after remount
    fireEvent.click(screen.getByTestId("toggle-btn"));
    expect(clicked).toBe(true);
  });
});
