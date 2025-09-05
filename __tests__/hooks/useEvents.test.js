
/**
 * @jest-environment jsdom
 */
import { useEvents } from "../../lib/hooks/useEvents.js";
import { createComponent } from "../../lib/reactive-core.js";
import { jest } from "@jest/globals";
import { useEmit } from "../../lib/hooks/useEmit.js";

describe("useEvents", () => {

test("mergeDataRefs merges multiple data-ref attributes into one", () => {
  let mergedHtml;
  const Comp = createComponent({
    render() {
      useEvents();
      // Simulate a tag with multiple data-ref attributes
      const html = '<div data-ref="a" data-ref="b" data-ref="c"></div>';
      // The hook should merge these
      mergedHtml = Comp._beforeRenderCbs[0](html);
      return mergedHtml;
    },
  });
  Comp();
  expect(mergedHtml).toBe('<div data-ref="a b c"></div>');
});

  it("modifies the API with .on method", () => {
    const Comp = createComponent({
      render() {
        useEvents();
        expect(typeof this.on).toBe("function");
        return `<div></div>`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);
    Comp.unmount();
  });

  it("can register and emit custom events", async () => {
    const handler = jest.fn();
    const Comp = createComponent({
      render() {
        const  {onClick} = useEvents();
        const attr = onClick(handler);
        return `<div ${attr}></div>`;
      },
    });
    const container = document.createElement("div");
    
    Comp.mount(container);
    const clicker = container.querySelector('[data-ref~=h0]');

    clicker.click();

    await Promise.resolve();
    expect(handler).toHaveBeenCalled();
    Comp.unmount();
  });

  it("can register and emit custom events", () => {
    const handler = jest.fn();
    const Comp = createComponent({
      render() {
        useEvents();
        useEmit();
        this.on("custom", handler);
        return `<div></div>`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);

    Comp.emit("custom", { foo: "bar" });
    expect(handler).toHaveBeenCalledWith({ foo: "bar" });
    Comp.unmount();
  });

  it("supports multiple handlers for the same event", () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const Comp = createComponent({
      render() {
        useEvents();
        useEmit();
        this.onEmit("multi", handler1);
        this.onEmit("multi", handler2);
        return `<div></div>`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);
    Comp.emit("multi", 123);
    expect(handler1).toHaveBeenCalledWith(123);
    expect(handler2).toHaveBeenCalledWith(123);
    Comp.unmount();
  });

  it("does not throw if emitting an event with no handlers", () => {
    let eventsApi;
    const Comp = createComponent({
      render() {
         useEvents();
         eventsApi = useEmit();
        return `<div></div>`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);
    expect(() => eventsApi.emit("nope", {})).not.toThrow();
    Comp.unmount();
  });
});
