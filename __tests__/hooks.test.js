import { createComponent } from "../lib/reactive-core.js";
import { useEffect } from "../lib/hooks/useEffect.js";
import { useFetch } from "../lib/hooks/useFetch.js";
import { jest } from "@jest/globals";

describe("hooks: useEffect and useFetch", () => {
  let container;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    document.body.innerHTML = "";
  });

  test("useEffect runs effect on mount and cleanup on unmount", () => {
    const calls = [];
    const Comp = createComponent(() => {
      useEffect(() => {
        calls.push("mount");
        return () => calls.push("unmount");
      });
      return `<div>Effect</div>`;
    });
    Comp.mount(container);
    Comp.unmount();
    expect(calls).toEqual(["mount", "unmount"]);
  });

  test("useFetch fetches data and updates state", async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ foo: "bar" })
    }));
    let didSubscribe = false;
    const Comp = createComponent(() => {
      const { get, subscribe } = useFetch("/api/test");
      const data = get().data;
      if (!didSubscribe) {
        subscribe((state) => {
          container.innerHTML = `<div>${state.data ? state.data.foo : "loading"}</div>`;
        });
        didSubscribe = true;
      }
      return `<div>${data ? data.foo : "loading"}</div>`;
    });
    Comp.mount(container);
    await new Promise((resolve, reject) => {
      const start = Date.now();
      (function check() {
        if (container.innerHTML.includes("bar")) return resolve();
        if (Date.now() - start > 1000) return reject(new Error("Timeout waiting for fetch"));
        setTimeout(check, 10);
      })();
    });
    expect(container.innerHTML).toContain("bar");
    Comp.unmount();
    global.fetch.mockRestore && global.fetch.mockRestore();
  });

  test("useFetch handles fetch error and emits error event", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("fail")));
    let errorEvent;
    const Comp = createComponent(() => {
      const { get, subscribe } = useFetch("/api/error");
      const data = get().data;
      if (!Comp._subscribed) {
        subscribe((state) => {
          container.innerHTML = `<div>${state.error ? state.error.message : "ok"}</div>`;
        });
        Comp._subscribed = true;
      }
      Comp.onEmit("fetch::error", ({ url, error }) => {
        errorEvent = { url, error };
      });
      return `<div>${data ? data.foo : "loading"}</div>`;
    });
    Comp.mount(container);
    await new Promise((resolve, reject) => {
      const start = Date.now();
      (function check() {
        if (container.innerHTML.includes("fail")) return resolve();
        if (Date.now() - start > 1000) return reject(new Error("Timeout waiting for error"));
        setTimeout(check, 10);
      })();
    });
    expect(container.innerHTML).toContain("fail");
    expect(errorEvent).toBeDefined();
    expect(errorEvent.url).toBe("/api/error");
    expect(errorEvent.error.message).toBe("fail");
    Comp.unmount();
    global.fetch.mockRestore && global.fetch.mockRestore();
  });

  test("useFetch manual refresh updates state", async () => {
    let callCount = 0;
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ foo: ++callCount })
    }));
    let Comp, refresh;
    Comp = createComponent(() => {
      const fetchApi = useFetch("/api/refresh");
      refresh = fetchApi.refresh;
      const data = fetchApi.get().data;
      if (!Comp._subscribed) {
        fetchApi.subscribe((state) => {
          container.innerHTML = `<div>${state.data ? state.data.foo : "loading"}</div>`;
        });
        Comp._subscribed = true;
      }
      return `<div>${data ? data.foo : "loading"}</div>`;
    });
    Comp.mount(container);
    await new Promise((resolve, reject) => {
      const start = Date.now();
      (function check() {
        if (container.innerHTML.includes("1")) return resolve();
        if (Date.now() - start > 1000) return reject(new Error("Timeout waiting for fetch"));
        setTimeout(check, 10);
      })();
    });
    refresh();
    await new Promise((resolve, reject) => {
      const start = Date.now();
      (function check() {
        if (container.innerHTML.includes("2")) return resolve();
        if (Date.now() - start > 1000) return reject(new Error("Timeout waiting for refresh"));
        setTimeout(check, 10);
      })();
    });
    expect(container.innerHTML).toContain("2");
    Comp.unmount();
    global.fetch.mockRestore && global.fetch.mockRestore();
  });

  test("useEffect throws if called outside render", () => {
    expect(() => useEffect(() => {})).toThrow();
  });
});
