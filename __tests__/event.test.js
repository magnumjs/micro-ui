import { event } from "../lib/compose/event.js";
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
      event("click #btn", mockHandler);
      return `<button id="btn">Click me</button>`;
    });

    Comp.mount(container);
    container.querySelector("#btn").click();
    expect(mockHandler).toHaveBeenCalled();
  });

  test("event: simplified event map", () => {
    const mockInputHandler = jest.fn();

    const Comp = createComponent(() => {
      event({
        "input": mockInputHandler, // Simplified event map without selector
      });
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

  test("event: throws error if used outside component", () => {
    expect(() => event("click", "#btn", () => {})).toThrow(
      "event() must be called inside a component"
    );
  });

  test("event: invalid arguments", () => {
    const Comp = createComponent(() => {
      expect(() => event(123, "#btn", () => {})).toThrow(
        "Invalid arguments passed to event()"
      );
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
      event({
        "input #input": mockInputHandler, // Event map with selector
      });
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
      event({
        "click #btn": mockClickHandler,
        "input #input": mockInputHandler,
      });
      return `
        <button id="btn">Click me</button>
        <input id="input" />
      `;
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
