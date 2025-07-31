/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core.js";
import { fireEvent, screen } from "@testing-library/dom";
import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("setState usage: this.setState vs destructured setState", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    container = null;
  });

  test("allows updating state using destructured setState",async  () => {
    const Comp = createComponent(({ state, setState }) => {
      return `
        <div>
          <span data-testid="count">${state.count}</span>
          <button data-testid="inc">+</button>
        </div>
      `;
    }, {
      state: { count: 0 },
      on: {
        "click [data-testid='inc']": ({ state, setState }) => {
          setState({ count: state.count + 1 });
        }
      }
    });

    Comp.mount(container);

    const btn = screen.getByTestId("inc");
    const span = screen.getByTestId("count");

    expect(span.textContent).toBe("0");
    fireEvent.click(btn);
    await new Promise((r) => setTimeout(r, 70));
    expect(screen.getByTestId("count").textContent).toBe("1");
  });

  test("allows updating state using this.setState inside onMount and event", async () => {
    const Comp = createComponent(function () {
      return `
        <div>
          <span data-testid="count">${this.state.count}</span>
          <button data-testid="inc">+</button>
        </div>
      `;
    }, {
      state: { count: 5 },
      onMount() {
        this.setState({ count: this.state.count + 1 }); // should become 6
      },
      on: {
        "click [data-testid='inc']"() {
          this.setState({ count: this.state.count + 1 }); // should become 7
        }
      }
    });

    Comp.mount(container);

    const btn = screen.getByTestId("inc");
    const span = screen.getByTestId("count");
    await Promise.resolve(); // Ensure async rendering completes
    expect(screen.getByTestId("count").textContent).toBe("6"); // after click
    fireEvent.click(btn);
    await Promise.resolve(); // Ensure async rendering completes
    expect(screen.getByTestId("count").textContent).toBe("7"); // after click
  });
});
