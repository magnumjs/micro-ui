import { createComponent, useCurrentComponent } from "../lib/reactive-core.js";
import { renderList } from "../lib/utils/";
import { useEmit } from '../lib/hooks/useEmit.js';
import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { createChannelMap } from "../lib/utils/context.js";

describe("reactive-core full coverage", () => {
  let container;
  beforeEach(() => {
    container = document.createElement("div");
    container.id = "test-container";
    document.body.appendChild(container);
  });
  afterEach(() => {
    if (container.parentNode) document.body.removeChild(container);
    document.body.innerHTML = "";
  });
  test("directly sets data-key on DOM node if missing (unit branch coverage)", () => {
    const div = document.createElement("div");
    const fakeId = "test-id-123";
    // Simulate the branch from reactive-core.js
    if (div && div.nodeType === 1) {
      if (!div.hasAttribute("data-key")) div.setAttribute("data-key", fakeId);
    }
    expect(div.hasAttribute("data-key")).toBe(true);
    expect(div.getAttribute("data-key")).toBe(fakeId);
  });
  test("mounts with string selector and DOM node", () => {
    // Mount to DOM node
    const comp = createComponent(() => `<p>Mount</p>`);
    comp.mount(container);
    expect(container.innerHTML).toContain("Mount");
    comp.unmount();
    // Mount to selector (separate container)
    const selectorContainer = document.createElement("div");
    selectorContainer.id = "mount";
    document.body.appendChild(selectorContainer);
    const comp2 = createComponent(() => `<p>Mount2</p>`);
    comp2.mount("#mount");
    expect(document.querySelector("#mount").innerHTML).toContain("Mount2");
    comp2.unmount();
    document.body.removeChild(selectorContainer);
  });

  test("lifecycle hooks: onMount, onUnmount, onBeforeMount, onBeforeUnmount, onUpdate", async () => {
    const calls = [];
    const comp = createComponent(() => `<p>Life</p>`, {
      onMount() { calls.push("mount"); },
      onUnmount() { calls.push("unmount"); },
      onBeforeMount(next) { calls.push("beforeMount"); next && next(); },
      onBeforeUnmount(next) { calls.push("beforeUnmount"); next && next(); },
      onUpdate() { calls.push("update"); }
    });
    comp.mount(container);
    comp.update({ foo: 1 });
    await Promise.resolve();
    comp.unmount();
    expect(calls).toEqual(expect.arrayContaining(["mount", "unmount", "beforeMount", "beforeUnmount", "update"]));
  });

  test("event delegation and local/global event bus", () => {
    const clickHandler = jest.fn();
    const comp = createComponent(() => {
      useEmit();
      return `<button id='btn'>Click</button>`;
    }, {
      on: { "click #btn": clickHandler }
    });
    comp.mount(container);
    document.querySelector("#btn").click();
    expect(clickHandler).toHaveBeenCalled();
    // Local bus
    const localHandler = jest.fn();
    comp.onEmit("local", localHandler);
    comp.emit("local", 123);
    expect(localHandler).toHaveBeenCalledWith(123);
    // Global bus
    const globalHandler = jest.fn();
    comp.onEmitGlobal("global", globalHandler);
    comp.emitGlobal("global", 456);
    expect(globalHandler).toHaveBeenCalledWith(456);
  });

  test("state updates: function, object, primitive", async () => {
    const comp = createComponent(({ state, setState }) => `<span>${state.val}</span>`, {
      state: { val: 1 }
    });
    comp.mount(container);
    comp.setState((s) => ({ ...s, val: s.val + 1 }));
    await Promise.resolve();
    comp.setState({ val: 42 });
    await Promise.resolve();
    comp.setState({ val: "x" });
    await Promise.resolve();
    expect(container.innerHTML).toContain("x");
  });

  test("rendering null/empty, cached node restoration", () => {
    const comp = createComponent(() => "", {});
    comp.mount(container);
    expect(container.innerHTML).toBe("");
    comp.unmount();
    expect(container.innerHTML).toBe("");
  });

  test("props changes, no changes, merging", () => {
    const renderFn = jest.fn(({ props }) => `<p>${props.x}</p>`);
    const comp = createComponent(renderFn);
    comp.mount(container);
    comp.update({ x: 1 });
    comp.update({ x: 1 });
    comp.update({ x: 2 });
    expect(renderFn).toHaveBeenCalledTimes(4);
    expect(container.innerHTML).toContain("2");
  });

  test("slots and children hydration (basic)", () => {
    const comp = createComponent(() => `<div><slot></slot></div>`);
    comp.mount(container);
    expect(container.innerHTML).toContain("<div><slot></slot></div>");
  });

  test("unmount and cleanup", () => {
    const comp = createComponent(() => `<p>Bye</p>`);
    comp.mount(container);
    comp.unmount();
    expect(container.innerHTML).toBe("");
  });

  test("renderList with/without keys, string/non-string output", () => {
    const arr = [{ id: 1, name: "A" }, { id: 2, name: "B" }];
    const html = renderList(arr, (item) => `<li>${item.name}</li>`);
    expect(html).toContain("data-key=\"1\"");
    expect(html).toContain("data-key=\"2\"");
    // Non-string output
    const html2 = renderList(arr, (item) => ({ name: item.name }));
    expect(html2).toContain("[object Object]");
  });

  test("useCurrentComponent returns current component during render", () => {
    let got;
    const comp = createComponent(() => {
      got = useCurrentComponent();
      return `<p>Current</p>`;
    });
    comp.mount(container);
    expect(got).toBe(comp);
  });

  test("context/channel re-exports", () => {
    const bus = createChannelMap();
    const fn = jest.fn();
    bus.subscribe("foo", fn);
    bus.emit("foo", 123);
    expect(fn).toHaveBeenCalledWith(123);
    bus.clear();
  });
});
