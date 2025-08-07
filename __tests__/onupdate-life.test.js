/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core.js";
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";
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

  test("onUpdate triggers setState and causes re-render", async () => {
    const renderSpy = jest.fn();

    const Comp = createComponent(
      ({ state, props }) => {
        renderSpy(state.count);
        return `<div>${props.label}: ${state.count}</div>`;
      },
      {
        state: { count: 0 },
        onMount() {
          // Manually trigger prop update after mount to invoke onUpdate
          this.update({ label: "Auto" });
        },
        onUpdate(prevProps) {

          if (this.state.count === 0) {
            this.setState({ count: 1 });
          }
        },
      }
    );

    Comp.mount(container, { label: "Initial" });

    // Wait for mount + prop update + setState update to flush
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(renderSpy).toHaveBeenCalledTimes(3);
    expect(container.innerHTML).toContain("Auto: 1");
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

    await new Promise((resolve) => setTimeout(resolve, 70));
    // onUpdate should run only once and not loop
    expect(logs).toEqual(["onMount", "onUpdate", "onUpdate"]);
    expect(container.textContent).toBe("1");
  });
});
