/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core.js";

describe("onUpdate lifecycle", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    container = null;
  });

  test("calls onUpdate after update but not on mount, avoids recursion", async () => {
    const logs = [];

    const Comp = createComponent(
      function ({ state, setState }) {
        return `<div>${state.count}</div>`;
      },
      {
        state: { count: 0 },
        onMount() {
          logs.push("onMount");
        },
        onUpdate() {
          logs.push("onUpdate");
          // Simulate one-time state update inside onUpdate
          if (this.state.count === 0) {
            this.setState({ count: 1 });
          }
        },
      }
    );

    Comp.mount(container);

    // After mount, should only have run onMount
    expect(logs).toEqual(["onMount"]);

    // Trigger update
    Comp.setState({ count: 0 });
    await Promise.resolve(); // Ensure all lifecycle hooks are processed
    // onUpdate should run only once and not loop
    expect(logs).toEqual(["onMount", "onUpdate"]);
    expect(container.textContent).toBe("1");
  });
});
