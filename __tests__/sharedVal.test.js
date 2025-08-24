import { createComponent } from "../lib/reactive-core.js";
import { shared } from "../lib/compose/shared.js";

describe("shared composable", () => {
  test("shared value is accessible across components", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const Comp1 = createComponent(function () {
      const [get, set] = shared("global", 100);
      this.onMount(() => set(200));
      return `<span>${get()}</span>`;
    });

    const Comp2 = createComponent(function () {
      const [get] = shared("global", 100);
      return `<strong>${get()}</strong>`;
    });

    Comp1.mount(container);
    Comp2.mount(container);
    await Promise.resolve();
    expect(container.innerHTML).toContain("200");
    expect(container.innerHTML).toContain("200");

    Comp1.unmount();
    Comp2.unmount();
    document.body.removeChild(container);
  });

  test("components automatically re-render when shared state changes", async () => {
    const containerA = document.createElement("div");
    const containerB = document.createElement("div");
    document.body.appendChild(containerA);
    document.body.appendChild(containerB);

    const CompA = createComponent(function () {
      const [get, set] = shared("autoRender", 1);
      this.onMount(() => {
        // simulate later update
        set(2);
      });
      return `<div class="a">${get()}</div>`;
    });

    const CompB = createComponent(function () {
      const [get] = shared("autoRender", 1);
      return `<div class="b">${get()}</div>`;
    });

    CompA.mount(containerA);
    CompB.mount(containerB);
    await Promise.resolve();

    // after mount + update
    expect(containerA.querySelector(".a").textContent).toBe("2");
    expect(containerB.querySelector(".b").textContent).toBe("2");

    CompA.unmount();
    CompB.unmount();
    document.body.removeChild(containerA);
    document.body.removeChild(containerB);
  });
});

describe("shared.js object merge coverage", () => {
  test("setState merges object properties", async () => {
    shared.clear();
    let result;
    const Comp = createComponent(() => {
      const [get, set] = shared("mergeTest", { a: 1, b: 2 });
      Comp.onMount(() => set({ b: 3, c: 4 }));
      result = get();
      return "<div></div>";
    });
    Comp.mount(document.createElement("div"));
    await Promise.resolve();
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  test("setState replaces with non-object", async () => {
    shared.clear();
    let result;
    const Comp = createComponent(() => {
      const [get, set] = shared("replaceTest", { a: 1 });

      Comp.onMount(() => set(42));
      result = get();
      return "<div></div>";
    });
    Comp.mount(document.createElement("div"));
    await Promise.resolve();
    expect(result).toBe(42);
  });

  test("setState with function updater", async () => {
    shared.clear();
    let result;
    const Comp = createComponent(() => {
      const [get, set] = shared("funcTest", { a: 1 });
      Comp.onMount(() => set((prev) => ({ ...prev, b: 2 })));
      result = get();
      return "<div></div>";
    });
    Comp.mount(document.createElement("div"));
    await Promise.resolve();
    expect(result).toEqual({ a: 1, b: 2 });
  });
});

describe("shared.js error coverage", () => {
  test("shared throws if called outside a component", () => {
    expect(() => shared("fail", 123)).toThrow(
      "shared() must be called inside a component"
    );
  });
});
