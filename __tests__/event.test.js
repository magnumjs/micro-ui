import { useEvent } from '../lib/hooks/useEvent.js';

import { createComponent } from "../lib/reactive-core.js";
import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("event.js coverage", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("event: single event type and handler", () => {
    const mockHandler = jest.fn();

    const Comp = createComponent(() => {
      return `<button id="btn">Click me</button>`;
    });

    Comp.addEvent("click #btn", mockHandler);

    Comp.mount(container);

    container.querySelector("#btn").click();
    expect(mockHandler).toHaveBeenCalled();
  });

  test("event: simplified event map", async () => {
    const mockInputHandler = jest.fn();

    const Comp = createComponent(() => {
      return `
        <input id="input" />
      `;
    });
    Comp.on["input"] = mockInputHandler; // Simplified event map without selector

    Comp.mount(container);

    const input = container.querySelector("#input");
    input.value = "test";
    const evt = new Event("input", { bubbles: true });
    input.dispatchEvent(evt);
    await Promise.resolve();
    expect(mockInputHandler).toHaveBeenCalled();
  });

  test("event: throws error if used outside component", () => {
    expect(() => useEvent("click #btn", () => {})).toThrow(
      "useEvent must be inside render()"
    );
  });

  test("event: invalid arguments", () => {
    const Comp = createComponent(() => {
      expect(typeof useEvent()).toBe("object");
      return `<div>Test</div>`;
    });

    Comp.mount(container);
  });

  test("event: direct input listener", () => {
    const mockInputHandler = jest.fn();

    const Comp = createComponent(() => {
      return `
        <input id="input" />
      `;
    });

    Comp.mount(container);

    const input = container.querySelector("#input");
    input.addEventListener("input", mockInputHandler);

    input.value = "test";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(mockInputHandler).toHaveBeenCalled();
  });

  test("event: event map with selector", () => {
    const mockInputHandler = jest.fn();

    const Comp = createComponent(() => {
      Comp.addEvent("input #input", mockInputHandler); // Event map with selector
      return `
        <input id="input" />
      `;
    });

    Comp.mount(container);

    const input = container.querySelector("#input");
    input.value = "test";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(mockInputHandler).toHaveBeenCalled();
  });

  test("event: multiple events", () => {
    const mockClickHandler = jest.fn();
    const mockInputHandler = jest.fn();

    const Comp = createComponent(() => {
      return `
        <button id="btn">Click me</button>
        <input id="input" />
      `;
    },{
      on: {
        "click #btn": mockClickHandler,
        "input #input": mockInputHandler,
      }
    });

    Comp.mount(container);

    const button = container.querySelector("#btn");
    const input = container.querySelector("#input");

    button.click();
    expect(mockClickHandler).toHaveBeenCalled();

    input.value = "test";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(mockInputHandler).toHaveBeenCalled();
  });
});
