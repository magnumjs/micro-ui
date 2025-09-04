  it("explicitly chains all event helpers for coverage (lines 13, 15, 18)", () => {
    let api;
    const handler = jest.fn();
    const Comp = createComponent({
      render() {
        api = useEvent();
        // Chain all helpers
        const attr = api
          .onBlur(handler)
          .onFocus(handler)
          .onInput(handler)
          .onChange(handler)
          .onSubmit(handler)
          .onClick(handler)
          .toString();
        return `<button ${attr}>Test</button>`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);
    const btn = container.querySelector("button");
    btn.dispatchEvent(new Event("blur", { bubbles: true }));
    btn.dispatchEvent(new Event("focus", { bubbles: true }));
    btn.dispatchEvent(new Event("input", { bubbles: true }));
    btn.dispatchEvent(new Event("change", { bubbles: true }));
    btn.dispatchEvent(new Event("submit", { bubbles: true }));
    btn.dispatchEvent(new Event("click", { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(6);
    Comp.unmount();
  });
/**
 * @jest-environment jsdom
 */

import { createComponent } from "../../lib/reactive-core.js";
import { useEvent } from "../../lib/hooks/useEvent.js";
import { jest } from "@jest/globals";

describe("useEvent", () => {

  it('covers useEvent.js lines 13, 15, 18 by chaining .on() -- ', () => {
    let api;
    const handlerA = jest.fn();
    const handlerB = jest.fn();
    const Comp = createComponent({
      render() {
        api = useEvent();
        return `<input ${api.on('customA', handlerA).on('customB', handlerB)} />`;
      }
    });
    const container = document.createElement('div');
    Comp.mount(container);
    const input = container.querySelector('input');
    input.dispatchEvent(new Event('customA', { bubbles: true }));
    input.dispatchEvent(new Event('customB', { bubbles: true }));
    expect(handlerA).toHaveBeenCalled();
    expect(handlerB).toHaveBeenCalled();
    Comp.unmount();
  });

  it("covers useEvent.js lines 13, 15, 18 by chaining .on()", () => {
    let api;
    const handlerA = jest.fn();
    const handlerB = jest.fn();
    const Comp = createComponent({
      render() {
        api = useEvent();
        return `<input ${api
          .on("customA", handlerA)
          .on("customB", handlerB)} />`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);
    const input = container.querySelector("input");
    input.dispatchEvent(new Event("customA", { bubbles: true }));
    input.dispatchEvent(new Event("customB", { bubbles: true }));
    expect(handlerA).toHaveBeenCalled();
    expect(handlerB).toHaveBeenCalled();
    Comp.unmount();
  });

  it("covers makeChainable and chaining (lines 13, 15, 18)", () => {
    let api;
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const handler3 = jest.fn();
    const Comp = createComponent({
      render() {
        api = useEvent();
        // Explicitly test chaining and toString
        return `<input ${api
          .onClick(handler1)
          .onBlur(handler2)
          .on("focus", handler3)} />`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);
    const input = container.querySelector("input");
    input.dispatchEvent(new Event("click", { bubbles: true }));
    input.dispatchEvent(new Event("blur", { bubbles: true }));
    input.dispatchEvent(new Event("focus", { bubbles: true }));
    expect(handler1).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
    expect(handler3).toHaveBeenCalled();
    // Test toString returns a data-ref
    const refAttr = api.onClick(handler1).onBlur(handler2).toString();
    expect(refAttr).toMatch(/data-ref="h[\w\d]+"/);
    Comp.unmount();
  });
  it("covers all event helpers", async () => {
    let api;
    const handlers = {
      input: jest.fn(),
      change: jest.fn(),
      submit: jest.fn(),
      focus: jest.fn(),
      blur: jest.fn(),
    };
    const Comp = createComponent({
      render() {
        api = useEvent();
        return `
          <input ${api
            .onInput(handlers.input)
            .onChange(handlers.change)
            .onFocus(handlers.focus)
            .onBlur(handlers.blur)} />
          <form ${api.onSubmit(handlers.submit)}></form>
        `;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);

    const input = container.querySelector("input");
    const form = container.querySelector("form");

    const evt = new Event("input", { bubbles: true });
    input.dispatchEvent(evt);
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.dispatchEvent(new Event("focus", { bubbles: true }));
    input.dispatchEvent(new Event("blur", { bubbles: true }));
    form.dispatchEvent(new Event("submit", { bubbles: true }));

    await Promise.resolve();

    expect(handlers.input).toHaveBeenCalled();
    expect(handlers.change).toHaveBeenCalled();
    expect(handlers.focus).toHaveBeenCalled();
    expect(handlers.blur).toHaveBeenCalled();
    expect(handlers.submit).toHaveBeenCalled();

    Comp.unmount();
  });
  it("throws if called outside a component render", () => {
    expect(() => useEvent()).toThrow("useEvent must be inside render()");
  });

  it("returns event attribute and registers handler", () => {
    let api;
    const handler = jest.fn();
    const Comp = createComponent({
      render() {
        api = useEvent();
        return `<button ${api.onClick(handler)}>Click</button>`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);
    const btn = container.querySelector("button");
    btn.click();
    expect(handler).toHaveBeenCalled();
    Comp.unmount();
  });

  it("returns event attribute and registers handler literal", () => {
    let api;
    const handler = jest.fn();
    const Comp = createComponent({
      render() {
        const { onClick } = useEvent();
        return `<button ${onClick(handler)}>Click</button>`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);
    const btn = container.querySelector("button");
    btn.click();
    expect(handler).toHaveBeenCalled();
    Comp.unmount();
  });

  it("supports generic event registration", () => {
    let api;
    const handler = jest.fn();
    const Comp = createComponent({
      render() {
        api = useEvent();
        return `<input ${api.on("input", handler)} />`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);
    const input = container.querySelector("input");
    input.dispatchEvent(new Event("input"));
    expect(handler).toHaveBeenCalled();
    Comp.unmount();
  });
});
