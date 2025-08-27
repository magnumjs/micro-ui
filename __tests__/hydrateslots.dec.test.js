/**
 * @jest-environment jsdom
 */
import { createComponent } from "../lib/reactive-core.js"; // adjust path
import { jest, describe, test, expect, beforeEach } from "@jest/globals";

describe("hydrateSlots with declarative data-comp", () => {
  let parentEl;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="parent">
      </div>
    `;
    parentEl = document.getElementById("parent");
  });

  test("mounts child via data-comp attribute and tracks in _mountedChildren", async () => {
    const parentComp = createComponent(
      () => `<p>Parent</p> <div data-comp="2"></div>`
    );

    createComponent("Hello Child");

    parentComp.mount(parentEl);

    expect(parentComp._mountedChildren.length).toBe(1);
    expect(parentEl.innerHTML).toContain("Hello Child");
  });
});

describe("Logic-only / unmounted component instance", () => {
  test("component instance exists before mount", () => {
    const Comp = createComponent({
      state: { count: 0 },
      render() {
        return null;
      },
    });

    expect(typeof Comp).toBe("function");
    expect(Comp.state).toEqual({ count: 0 });
    expect(Comp.isMounted()).toBe(false);
  });

  test("setState works before mounting", () => {
    const Comp = createComponent({
      state: { count: 0 },
      render() {
        return null;
      },
    });

    Comp.setState({ count: 5 });
    expect(Comp.state.count).toBe(5);

    // Using function style
    Comp.setState((prev) => ({ count: prev.count + 1 }));
    expect(Comp.state.count).toBe(6);
  });

  test("custom methods can be attached before mounting", () => {
    const Comp = createComponent({
      render() {
        return null;
      },
    });
    Comp.sayHi = () => "hi";
    expect(Comp.sayHi()).toBe("hi");
  });

  test("mounting triggers lifecycle and retains instance", async () => {
    const target = document.createElement("div");
    const mockMount = jest.fn();
    const Comp = createComponent({
      render() {
        return "<!-- -->";
      },
      onMount() {
        mockMount();
      },
    });

    expect(Comp.isMounted()).toBe(false);
    Comp.mount(target);
    await Promise.resolve(); // Wait for the next tick

    expect(mockMount).toHaveBeenCalled();
    expect(Comp.isMounted()).toBe(true);

    // State and methods still accessible
    Comp.custom = 123;
    expect(Comp.custom).toBe(123);
  });

  test("component works if never mounted", () => {
    const Comp = createComponent({
      state: { foo: "bar" },
      render() {
        return null;
      },
    });

    expect(Comp.state.foo).toBe("bar");
    Comp.setState({ foo: "baz" });
    expect(Comp.state.foo).toBe("baz");
    expect(Comp.isMounted()).toBe(false);
  });
});
