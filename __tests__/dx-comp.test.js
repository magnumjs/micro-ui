/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core.js"; // Adjust path as needed

describe("createComponent DX with state, setState, and event on map", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    container.id = "app";
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  test("renders initial state and updates state on event", () => {
    const Counter = createComponent(
      ({ state }) => `<button>Count: ${state.count}</button>`,
      {
        state: { count: 0 },
        on: {
          "click button": ({ setState }) => setState((s) => ({ count: s.count + 1 })),
        },
      }
    );

    // Mount by selector string
    Counter.mount("#app");
    expect(container.innerHTML).toContain("Count: 0");

    // Simulate click event on button
    const button = container.querySelector("button");
    expect(button).not.toBeNull();

    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(container.innerHTML).toContain("Count: 1");

    // Test mounting via element directly
    const Another = createComponent(
      ({ state }) => `<div data-ref="txt">Value: ${state.value}</div>`,
      { state: { value: 42 } }
    );

    Another.mount(container);
    expect(container.querySelector("[data-ref='txt']").textContent).toBe("Value: 42");
  });
});
