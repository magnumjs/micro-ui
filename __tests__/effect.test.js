import { effect } from "../lib/compose/effect.js";
import { slot } from "../lib/compose/value.js";
import { createComponent } from "../lib/reactive-core.js";
import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("effect.js coverage", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test("effect: runs callback on mount and cleanup on unmount", () => {
    const mockEffect = jest.fn(() => jest.fn());

    const Comp = createComponent(() => {
      effect(mockEffect);
      return `<div>Test Component</div>`;
    });

    Comp.mount(container);
    expect(mockEffect).toHaveBeenCalled();

    Comp.unmount();
    expect(mockEffect.mock.results[0].value).toHaveBeenCalled();
  });

  test("effect: runs callback only once when deps are empty", () => {
    const mockEffect = jest.fn(() => jest.fn());

    const Comp = createComponent(() => {
      effect(mockEffect, []);
      return `<div>Test Component</div>`;
    });

    Comp.mount(container);
    expect(mockEffect).toHaveBeenCalledTimes(1);

    Comp.unmount();
    expect(mockEffect.mock.results[0].value).toHaveBeenCalled();
  });

  test("effect: runs callback on deps change", () => {
    const mockEffect = jest.fn(() => jest.fn());
    let api;

    const Comp = createComponent(() => {
      if (!api) api = slot(0);
      effect(mockEffect, [api[0]()]);
      return `<div>${api[0]()}</div>`;
    });

    Comp.mount(container);
    expect(mockEffect).toHaveBeenCalledTimes(1);

    api[1](1);
    expect(mockEffect).toHaveBeenCalledTimes(2);

    Comp.unmount();
    expect(mockEffect.mock.results[1].value).toHaveBeenCalled();
  });

  test("effect: throws error if used outside component", () => {
    expect(() => effect(() => {})).toThrow("effect() must be called inside a component");
  });
});
