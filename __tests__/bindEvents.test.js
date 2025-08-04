/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core.js";

import bindEvents from "../lib/bindEvents";
import { describe, test, expect, jest } from "@jest/globals";

function waitUntil(predicate) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (predicate()) {
        clearInterval(interval);
        resolve();
      }
    }, 10);
  });
}

describe("bindEvents", () => {
  let root, el, api, boundEvents, handler;

  beforeEach(() => {
    document.body.innerHTML = `<div id="root"><div></div></div>`;
    el = document.getElementById("root");
    root = el.firstElementChild;
    boundEvents = [];

    handler = jest.fn();

    api = {
      state: { ok: true },
      setState: jest.fn(),
      props: { test: true },
      refs: {},
    };
  });

  function simulateClick(target) {
    const evt = new MouseEvent("click", { bubbles: true });
    target.dispatchEvent(evt);
  }

  test("calls handler via data-action and colon args", () => {
    root.innerHTML = `<button data-action="save:123:true">Click me</button>`;
    bindEvents(api, el, { "click:save": handler }, boundEvents);

    const btn = root.querySelector("button");
    simulateClick(btn);

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].action).toBe("save");
    expect(handler.mock.calls[0][0].args).toEqual(["123", "true"]);
  });

  test("calls handler with data-args array", () => {
    root.innerHTML = `<button data-action="delete" data-args='[1,"yes"]'>X</button>`;
    bindEvents(api, el, { "click:delete": handler }, boundEvents);

    simulateClick(root.querySelector("button"));

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].action).toBe("delete");
    expect(handler.mock.calls[0][0].args).toEqual([1, "yes"]);
  });

  test("calls handler with data-args object", () => {
    root.innerHTML = `<button data-action="submit" data-args='{"id":99,"confirm":true}'>Submit</button>`;
    bindEvents(api, el, { "click:submit": handler }, boundEvents);

    simulateClick(root.querySelector("button"));

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].args).toEqual([{ id: 99, confirm: true }]);
  });

  test("falls back to selector match when no data-action", () => {
    root.innerHTML = `<button class="save-btn">Save</button>`;
    bindEvents(api, el, { "click .save-btn": handler }, boundEvents);

    simulateClick(root.querySelector("button"));

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].event).toBeInstanceOf(MouseEvent);
  });

  test("ignores invalid JSON in data-args", () => {
    console.warn = jest.fn();
    root.innerHTML = `<button data-action="do" data-args="{oops:123}">Bad</button>`;
    bindEvents(api, el, { "click:do": handler }, boundEvents);

    simulateClick(root.querySelector("button"));

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].args).toEqual([]);
    expect(console.warn).toHaveBeenCalledWith(
      "Invalid JSON in data-args:",
      "{oops:123}"
    );
  });

  test("skips binding if root is missing", () => {
    el.innerHTML = "";
    bindEvents(api, el, { "click:do": handler }, boundEvents);
    expect(boundEvents.length).toBe(0);
  });

  test("supports wildcard events and action", () => {
    root.innerHTML = `<button data-action="foo:bar">Click</button>`;
    bindEvents(api, el, { "*:*": handler }, boundEvents);

    simulateClick(root.querySelector("button"));

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].action).toBe("foo");
    expect(handler.mock.calls[0][0].args).toEqual(["bar"]);
  });

  test("handles keydown event with action", () => {
    root.innerHTML = `<input type="text" data-action="key:Enter">`;
    bindEvents(api, el, { "keydown:key": handler }, boundEvents);

    const input = root.querySelector("input");
    const evt = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
    input.dispatchEvent(evt);

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].action).toBe("key");
  });

  test("handles input event with data-action", () => {
    root.innerHTML = `<input type="text" data-action="update">`;
    bindEvents(api, el, { "input:update": handler }, boundEvents);

    const input = root.querySelector("input");
    const evt = new Event("input", { bubbles: true });
    input.dispatchEvent(evt);

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].event.type).toBe("input");
  });

  test("handles form submit with action", () => {
    root.innerHTML = `
    <form data-action="save:form">
      <button type="submit">Submit</button>
    </form>`;
    bindEvents(api, el, { "submit:save": handler }, boundEvents);

    const form = root.querySelector("form");
    const evt = new Event("submit", { bubbles: true });
    form.dispatchEvent(evt);

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].action).toBe("save");
    expect(handler.mock.calls[0][0].args).toEqual(["form"]);
  });

  test("wildcard event with specific action", () => {
    root.innerHTML = `<button data-action="ping:42">Ping</button>`;
    bindEvents(api, el, { "*:ping": handler }, boundEvents);

    simulateClick(root.querySelector("button"));

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].action).toBe("ping");
    expect(handler.mock.calls[0][0].args).toEqual(["42"]);
  });

  test("wildcard event and wildcard action", () => {
    root.innerHTML = `<button data-action="do:something">Go</button>`;
    bindEvents(api, el, { "*:*": handler }, boundEvents);

    simulateClick(root.querySelector("button"));

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].action).toBe("do");
    expect(handler.mock.calls[0][0].args).toEqual(["something"]);
  });

  test("supports custom DOM events", () => {
    root.innerHTML = `<div data-action="custom:test">Box</div>`;
    bindEvents(api, el, { "custom:custom": handler }, boundEvents);

    const div = root.querySelector("div");
    const evt = new CustomEvent("custom", { bubbles: true });
    div.dispatchEvent(evt);

    expect(handler).toHaveBeenCalled();
  });
});

describe("bindEvents", () => {
  test("supports custom DOM events", () => {
    document.body.innerHTML = `
    <div id="app">
      <button data-action="myEvent:arg1:arg2" data-args='["x","y"]'>Click</button>
    </div>
  `;
    const el = document.querySelector("#app");

    const api = {
      state: {},
      setState: jest.fn(),
      props: {},
      refs: {},
    };

    const boundEvents = [];
    const handler = jest.fn();

    bindEvents(
      api,
      el,
      {
        "myEvent:myEvent": handler,
      },
      boundEvents
    );

    const button = el.querySelector("button");
    const evt = new CustomEvent("myEvent", { bubbles: true });
    button.dispatchEvent(evt);

    expect(handler).toHaveBeenCalledTimes(1);

    const ctx = handler.mock.calls[0][0];
    expect(ctx.action).toBe("myEvent");
    expect(ctx.args).toEqual(["x", "y"]);
    expect(ctx.event).toBe(evt);
  });

  test("data-action triggers handler with parsed data-args", async () => {
    const spy = jest.fn();

    const Demo = createComponent(
      () => `
    <button data-action="sayHello" data-args='{"name":"Tova"}'>Hi</button>
  `,
      {
        on: {
          "click:sayHello"({ args }) {
            spy(args[0]); // args will be [{ name: "Tova" }]
          },
        },
      }
    );

    document.body.innerHTML = "";
    const root = document.createElement("div");
    document.body.appendChild(root);
    Demo.mount(root);

    const button = root.querySelector("button");
    button.click();

    await waitUntil(() => spy.mock.calls.length > 0);

    expect(spy).toHaveBeenCalledWith({ name: "Tova" });

    Demo.unmount();
    document.body.removeChild(root);
  });
});
