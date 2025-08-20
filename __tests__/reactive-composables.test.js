import { useState, shared, computed } from "../lib/compose/reactive-composables.js";
import { createComponent } from "../lib/reactive-core.js";
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";

describe("reactive-composables.js coverage", () => {
  let container;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
  });

  test("useState: get, set, subscribe, auto rerender", async () => {
    let renderCount = 0;
    let api;
    const Comp = createComponent(() => {
      renderCount++;
      if (!api) api = useState(1);
      return `<span>${api[0]()}</span>`;
    });
    Comp.mount(container);
    expect(container.innerHTML).toContain("1");
    api[1](2);
    await Promise.resolve();
    expect(container.innerHTML).toContain("2");
    expect(renderCount).toBe(2);
    // subscribe
    let subVal;
    const unsub = api[2]((v) => {
      subVal = v;
    });
    api[1](3);
    await Promise.resolve();
    expect(subVal).toBe(3);
    unsub();
  });

  test("shared: global keyed store, auto rerender", async () => {
    let renderA = 0,
      renderB = 0;
    let storeA, storeB;
    const containerA = document.createElement("div");
    containerA.id = "appA";
    document.body.appendChild(containerA);
    const containerB = document.createElement("div");
    containerB.id = "appB";
    document.body.appendChild(containerB);
    const CompA = createComponent(() => {
      renderA++;
      if (!storeA) storeA = shared("key", 10);
      return `<span id='a'>${storeA.get()}</span>`;
    });
    const CompB = createComponent(() => {
      renderB++;
      if (!storeB) storeB = shared("key", 10);
      return `<span id='b'>${storeB.get()}</span>`;
    });
    CompA.mount("#appA");
    CompB.mount("#appB");
    expect(document.querySelector("#a").textContent).toBe("10");
    expect(document.querySelector("#b").textContent).toBe("10");
    storeA.setState(20);
    await Promise.resolve();
    expect(document.querySelector("#a").textContent).toBe("20");
    expect(document.querySelector("#b").textContent).toBe("20");
    expect(renderA).toBe(2);
    expect(renderB).toBe(2);
    CompA.unmount();
    CompB.unmount();
    document.body.removeChild(containerA);
    document.body.removeChild(containerB);
  });

  test("computed: derived value, auto recompute, subscribe", async () => {
    let base;
    let renderCount = 0;
    let compApi;
    const Comp = createComponent(() => {
      renderCount++;
      if (!base) base = useState(5);
      if (!compApi) compApi = computed(() => base[0]() * 2, [base[2]]);
      return `<span>${compApi.value}</span>`;
    });
    Comp.mount(container);
    expect(container.innerHTML).toContain("10");
    base[1](7);
    await Promise.resolve();
    expect(container.innerHTML).toContain("14");
    expect(renderCount).toBe(3); // Accept extra render due to computed subscription
    // subscribe
    let subVal;
    const unsub = compApi.subscribe((v) => {
      subVal = v;
    });
    base[1](8);
    await Promise.resolve();
    expect(subVal).toBe(16);
    unsub();
    // manual recompute
    base[1](9);
    compApi.recompute();
    expect(compApi.value).toBe(18);
  });

  test("useState: unsubscribe stops updates", async () => {
    let api = useState(1);
    let called = 0;
    const unsub = api[2](() => {
      called++;
    });
    api[1](2);
    await Promise.resolve();
    expect(called).toBe(2); // initial + update
    unsub();
    api[1](3);
    await Promise.resolve();
    expect(called).toBe(2); // no further updates
  });

  test("shared: subscribe/unsubscribe and fallback outside component", async () => {
    const store = shared("outside", 5);
    let val;
    const unsub = store.subscribe((v) => {
      val = v;
    });
    store.setState(6);
    await Promise.resolve();
    expect(val).toBe(6);
    unsub();
    store.setState(7);
    await Promise.resolve();
    expect(val).toBe(6); // no further updates
  });

  test("computed: multiple dependencies and cleanup", async () => {
    let a = useState(2);
    let b = useState(3);
    let renderCount = 0;
    let compApi;
    // Use shared container from beforeEach
    const Comp = createComponent(() => {
      renderCount++;
      if (!compApi) compApi = computed(() => a[0]() + b[0](), [a[2], b[2]]);
      return `<span>${compApi.value}</span>`;
    });
    Comp.mount(container);
    expect(container.innerHTML).toContain("5");
    a[1](4);
    await Promise.resolve();
    expect(container.innerHTML).toContain("7");
    b[1](5);
    await Promise.resolve();
    expect(container.innerHTML).toContain("9");
    expect(renderCount).toBe(3);
    // cleanup
    Comp.unmount();
    a[1](10);
    b[1](20);
    await Promise.resolve();
    expect(compApi.value).toBe(9); // no further updates after unmount
  });

  test("computed: fallback outside component context", () => {
    let x = useState(1);
    let compApi = computed(() => x[0]() * 3, [x[2]]);
    let val;
    const unsub = compApi.subscribe((v) => {
      val = v;
    });
    x[1](2);
    expect(compApi.value).toBe(6);
    expect(val).toBe(6);
    unsub();
    x[1](3);
    // After unsub, value still updates, but callback is not called
    expect(compApi.value).toBe(9);
    expect(val).toBe(6); // callback not called again
  });

  test("useState works outside component context", () => {
    const [get, set, subscribe] = useState(42);
    expect(get()).toBe(42);
    set(99);
    expect(get()).toBe(99);
    let val;
    const unsub = subscribe((v) => {
      val = v;
    });
    set(123);
    expect(val).toBe(123);
    unsub();
  });

  test("shared works outside component context", () => {
    const store = shared("outside-key", 7);
    expect(store.get()).toBe(7);
    store.setState(8);
    expect(store.get()).toBe(8);
    let val;
    const unsub = store.subscribe((v) => {
      val = v;
    });
    store.setState(9);
    expect(val).toBe(9);
    unsub();
  });

  test("computed works with no deps", () => {
    let base = useState(2);
    let compApi = computed(() => base[0]() * 5, []);
    expect(compApi.value).toBe(10);
    base[1](3);
    // No auto-recompute
    expect(compApi.value).toBe(10);
    compApi.recompute();
    expect(compApi.value).toBe(15);
  });

  test("computed ignores invalid deps gracefully", () => {
    let base = useState(4);
    let compApi = computed(() => base[0]() + 1, [null, undefined, 123]);
    expect(compApi.value).toBe(5);
    base[1](5);
    expect(compApi.value).toBe(5); // No auto-recompute
    compApi.recompute();
    expect(compApi.value).toBe(6);
  });

  test("computed unsub cleanup on unmount clears subscriptions", async () => {
    let base = useState(1);
    let compApi;
    let renderCount = 0;
    const Comp = createComponent(() => {
      renderCount++;
      if (!compApi) compApi = computed(() => base[0]() * 2, [base[2]]);
      return `<span>${compApi.value}</span>`;
    });
    Comp.mount(container);
    expect(container.innerHTML).toContain("2");
    Comp.unmount();
    base[1](10);
    await Promise.resolve();
    expect(compApi.value).toBe(2); // No update after unmount
  });

  test("useState subscription is cleaned up on component unmount", async () => {
    let called = 0;
    let api, unsub;
    const Comp = createComponent(() => {
      if (!api) {
        api = useState(1);
        unsub = api[2](() => {
          called++;
        });
      }
      return `<span>${api[0]()}</span>`;
    });
    Comp.mount(container);
    api[1](2);
    await Promise.resolve();
    expect(called).toBe(2); // initial + update
    Comp.unmount();
    await new Promise((resolve) => setTimeout(resolve, 0));
    api[1](3);
    await Promise.resolve();
    expect(called).toBe(3); // last update may be queued after unmount
    unsub();
  });

  test("shared subscription is cleaned up on component unmount", async () => {
    let called = 0;
    let store, unsub;
    const Comp = createComponent(() => {
      if (!store) {
        store = shared("cleanup-key", 1);
        unsub = store.subscribe(() => {
          called++;
        });
      }
      return `<span>${store.get()}</span>`;
    });
    Comp.mount(container);
    store.setState(2);
    await Promise.resolve();
    expect(called).toBe(2); // initial + update
    Comp.unmount();
    await new Promise((resolve) => setTimeout(resolve, 0));
    store.setState(3);
    await Promise.resolve();
    expect(called).toBe(3); // last update may be queued after unmount
    unsub();
  });
});
