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
        const { onClick } = useEvents();
        const attr = onClick(handler);
        return `<div ${attr}></div>`;
      },
    });
    const container = document.createElement("div");

    Comp.mount(container);
    const clicker = container.querySelector("[data-ref~=h0]");

    clicker.click();

    await Promise.resolve();
    expect(handler).toHaveBeenCalled();
    Comp.unmount();
  });

  it("multiple onClick handlers on multiple elements update fresh data on each click", async () => {
    let foo = 0,
      bar = 10;
    const Comp = createComponent({
      render() {
        const { onClick } = useEvents();
        const fooAttr = onClick(() => {
          foo++;
        });
        const barAttr = onClick(() => {
          bar += 5;
        });
        return `<div>
            <button id='foo' ${fooAttr}>foo:${foo}</button>
            <button id='bar' ${barAttr}>bar:${bar}</button>
          </div>`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);
    const btnFoo = container.querySelector("#foo");
    const btnBar = container.querySelector("#bar");
    // Click foo 3 times
    btnFoo.click();
    btnFoo.click();
    btnFoo.click();
    // Click bar 2 times
    btnBar.click();
    btnBar.click();
    await Promise.resolve();
    // Re-render to show fresh data
    Comp.update();
    expect(container.innerHTML).toContain("foo:3");
    expect(container.innerHTML).toContain("bar:20");
    Comp.unmount();
  });

  it("multiple click handlers on one element are all called and update data", async () => {
    let a = 0,
      b = 0;
    const Comp = createComponent({
      render() {
        const { onClick } = useEvents();
        // Attach two click handlers to the same button
        const attr1 = onClick(() => {
          a++;
        });
        const attr2 = onClick(() => {
          b += 2;
        });
        return `<button id='multi' ${attr1} ${attr2}>a:${a},b:${b}</button>`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);
    const btn = container.querySelector("#multi");
    // Click the button 4 times
    btn.click();
    btn.click();
    btn.click();
    btn.click();
    await Promise.resolve();
    // Re-render to show fresh data
    Comp.update();
    expect(container.innerHTML).toContain("a:4");
    expect(container.innerHTML).toContain("b:8");
    Comp.unmount();
  });

  it("inline this.on('click', handler) in element works and updates data", async () => {
    let clicks = 0;
    const Comp = createComponent({
      render() {
        useEvents();
        return `<button id='inline' ${this.on("click", () => {
          clicks++;
        })}>clicks:${clicks}</button>`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);
    const btn = container.querySelector("#inline");
    btn.click();
    btn.click();
    btn.click();
    await Promise.resolve();
    Comp.update();
    expect(container.innerHTML).toContain("clicks:3");
    Comp.unmount();
  });

  it("multiple inline this.on('click', handler) calls on one element all work and update data", async () => {
    let a = 0,
      b = 0;
    const Comp = createComponent({
      render() {
        useEvents();
        return `<button id='multi-inline' ${this.on("click", () => {
          a++;
        })} ${this.on("click", () => {
          b += 2;
        })}>a:${a},b:${b}</button>`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);
    const btn = container.querySelector("#multi-inline");
    btn.click();
    btn.click();
    btn.click();
    btn.click();
    await Promise.resolve();
    Comp.update();
    expect(container.innerHTML).toContain("a:4");
    expect(container.innerHTML).toContain("b:8");
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
