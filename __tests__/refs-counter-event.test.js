/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core";

describe("Counter component", () => {
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

  test("renders and increments count on click", async () => {
    const Counter = createComponent(
      ({ state, setState }) => {
        console.log("Rendering Counter with state:", state);
        return `<button data-ref="btn">Count: ${state.count}</button>`;
      },
      {
        state: { count: 0 },
        onMount() {
          this.refs.btn.addEventListener("click", () => {
            this.setState({ count: this.state.count + 1 });
          });
        },
      }
    );

    // Mount the component
    Counter.mount("#app");

    const button = container.querySelector("button");

    expect(button).toBeTruthy();
    expect(button.textContent).toBe("Count: 0");

    // Simulate click
    button.click();

    // state update is async (microtask)
    await Promise.resolve();
    expect(container.querySelector("button").textContent).toBe("Count: 1");

    button.click();
    await Promise.resolve();
    expect(container.querySelector("button").textContent).toBe("Count: 2");
  });
});
