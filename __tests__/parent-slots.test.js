/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core";
import { jest, describe, test, expect } from "@jest/globals";

describe("Parent component with named & default slots", () => {
  let log;
  beforeEach(() => {
    document.body.innerHTML = "";
    log = [];
    jest.spyOn(console, "log").mockImplementation((...args) => {
      log.push(args.join(" "));
    });
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it("renders, updates, and toggles slots correctly", async () => {
    const Button = createComponent(() => {
      return `<button>Say Hello!</button>`;
    });

    const Child = createComponent(() => {
      return `<div>Child like</div>`;
    });

    const Parent = createComponent(
      ({ state }) => {
        console.log("render");
        return `
        <div>
          <slot name="button">defaults...</slot>
          ${state.show ? `<slot>defaults</slot>` : `Loaded`}
        </div>
      `;
      },
      {
        state: { show: false },
        on: {
          "click button"() {
            console.log("clicked");
            this.setState({ show: !this.state.show });
          },
        },
        onUpdate() {
          console.log("updated");
        },
        onMount() {
          console.log("mounted");
          this.setState({ show: true });
        },
      }
    );

    // Mount with slots
    Parent.mount(document.body, {
      slots: {
        button: Button,
        default: Child,
      },
    });

    // Initial render
    expect(document.body.innerHTML).toContain("Say Hello!");
    expect(document.body.innerHTML).toContain("Loaded");

    await Promise.resolve();
    // After onMount triggers state change to show default slot
    expect(document.body.innerHTML).toContain("Child like");
    expect(document.body.innerHTML).not.toContain("Loaded");

    console.log('log', document.body.innerHTML);
    // Click button -> should toggle back to "Loaded"
    document.querySelector("button").click();
    await Promise.resolve();

    expect(document.body.innerHTML).toContain("Loaded");
    expect(document.body.innerHTML).not.toContain("Child like");

    // Click again -> should toggle to child slot again
    document.querySelector("button").click();
    await Promise.resolve();

    expect(document.body.innerHTML).toContain("Child like");

    // Verify console log calls (order may vary slightly)
    expect(log).toContain("mounted");
    expect(log).toContain("updated");
    expect(log).toContain("clicked");
  });
});
