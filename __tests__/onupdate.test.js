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

describe("createComponent onupdate with prevProps", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  test("onupdate prevprops from setState", async () => {
    const updates = [];

    const Comp = createComponent(
      ({ state, setState, props }) => {
        return `<div>${props.label}: ${state.count}</div>`;
      },
      {
        state: { count: 0 },
        onUpdate(prev) {
          console.log("onUpdate", prev.label, this.props.label);
          updates.push([prev.label, this.props.label]);
        },
      }
    );

    Comp.mount(container, { label: "Counter" });

    await Promise.resolve();
    await Promise.resolve();

    Comp.setState({ count: 1 });
        await new Promise((resolve) => setTimeout(resolve, 70));

    Comp.setState({ count: 2 });

    await new Promise((resolve) => setTimeout(resolve, 70));

    expect(updates).toEqual([
      ["Counter", "Counter"],
      ["Counter", "Counter"],
    ]);
  });

  test("onupdate prevprops", async () => {
    const updates = [];

    const Comp = createComponent(
      ({ props }) => {
        return `<div>${props.text}</div>`;
      },
      {
        onUpdate(prev) {
          console.log("onUpdate", prev.text, this.props.text);
          updates.push([prev.text, this.props.text]);
        },
      }
    );

    Comp.mount(container, { text: "Initial text" });

    // Wait for initial render to finish
    await Promise.resolve();

    Comp.update({ text: "One" });
    Comp.update({ text: "Two" });

    // Wait for both updates to flush
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    expect(updates).toEqual([
      ["Initial text", "One"],
      ["One", "Two"],
    ]);
  });
});
