import { useState, useEffect } from "../../lib/hooks/index.js";
import { createComponent } from "../../lib/reactive-core.js";
import { jest } from "@jest/globals";


describe("useState counter", () => {
  it("increments and updates HTML on multiple clicks",  () => {
    let container;
    const Comp = createComponent({
      render() {
        const [count, setCount] = useState(0);

        this.clicker = () => setCount(c => c + 1);
        return `<button data-action-click="clicker">${count}</button>`;
      },
    });
    container = document.createElement("div");
    Comp.mount(container);
    const btn = container.querySelector("button");
    // Simulate multiple clicks
    for (let i = 0; i < 5; i++) {
      btn.click();
    }

    expect(container.innerHTML).toContain("5");
    // Click again
    btn.click();
    expect(container.innerHTML).toContain("6");
  });
  it("increments and updates HTML on multiple clicks with setter",  () => {
    let container;
    const Comp = createComponent({
      state: { count: 0 },
      render() {
        useState(0);

        this.clicker = () => this.setCount(c => c + 1);
        return `<button data-action-click="clicker">${this.state.count}</button>`;
      },
    });
    container = document.createElement("div");
    Comp.mount(container);
    const btn = container.querySelector("button");
    // Simulate multiple clicks
    for (let i = 0; i < 5; i++) {
      btn.click();
    }

    expect(container.innerHTML).toContain("5");
    // Click again
    btn.click();
    expect(container.innerHTML).toContain("6");
  });
});

  describe("dynamic setters for multiple state fields", () => {
    it("updates multiple fields and re-renders for each", async () => {
      let renderCount = 0;
      const Comp = createComponent({
        state: { foo: 1, bar: 10 },
        render() {
            useState(0);
          renderCount++;
          // Use dynamic setters
          const { foo, bar } = this.state;
          this.incFoo = () => this.setFoo(f => f + 1);
          this.incBar = () => this.setBar(b => b + 5);
          return `<div>
            <button data-action-click="incFoo">foo:${foo}</button>
            <button data-action-click="incBar">bar:${bar}</button>
          </div>`;
        },
      });
      const container = document.createElement("div");
      Comp.mount(container);
      const btnFoo = container.querySelector("button[data-action-click='incFoo']");
      const btnBar = container.querySelector("button[data-action-click='incBar']");
      // Click foo 3 times
      btnFoo.click();
      btnFoo.click();
      btnFoo.click();
      // Click bar 2 times
      btnBar.click();
      btnBar.click();
      await Promise.resolve();
      expect(container.innerHTML).toContain("foo:4");
      expect(container.innerHTML).toContain("bar:20");
      // Should have re-rendered for each change
      expect(renderCount).toBeGreaterThanOrEqual(6);
    });
  });

describe("useState", () => {
  it("throws if useState is called outside render", () => {
    expect(() => useState()).toThrow();
  });

  it("does not rerender if state is Object.is equal", () => {
    let renderCount = 0;
    const Comp = createComponent({
      render() {
        useState(1);
        renderCount++;
        return `<div></div>`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);
    Comp.setState(1); // Should not rerender
    expect(renderCount).toBe(1);
  });

  it("cleans up state on unmount", () => {
    let cleaned = false;
    const Comp = createComponent({
      render() {
        const [state, setState] = useState(1);
        // Simulate cleanup
        useEffect(
          () => () => {
            cleaned = true;
          },
          []
        );
        return `<div></div>`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);
    Comp.unmount();
    expect(cleaned).toBe(true);
  });

  it("throws if called outside a component render", () => {
    expect(() => useState(0)).toThrow("useState must be inside render()");
  });
  it("auto-generates setters for object state and updates only on change", async () => {
    let count, setCount, value, setValue;
    const Comp = createComponent({
      state: { count: 0, value: "a" },
      render() {
        [count, setCount] = useState(Comp.state.count);
        [value, setValue] = useState(Comp.state.value);
        return "<div></div>";
      },
    });
    if (Comp.mount) {
      Comp.mount(document.createElement("div"));
    } else {
      Comp();
    }
    // Test auto-generated setter exists
    expect(typeof Comp.setCount).toBe("function");
    expect(typeof Comp.setValue).toBe("function");
    // Update count and value
    Comp.setCount(5);
    Comp.setValue("b");
    await Promise.resolve();
    expect(Comp.state.count).toBe(5);
    expect(Comp.state.value).toBe("b");
    // Should not update if value is unchanged
    const prevCount = Comp.state.count;
    Comp.setCount(5);
    await Promise.resolve();
    expect(Comp.state.count).toBe(prevCount);
  });
  it("initializes and gets value inside a component", () => {
    let val;
    const Comp = createComponent({
      render() {
        [val] = useState(5);
        return "";
      },
    });
    if (Comp.mount) {
      Comp.mount(document.createElement("div"));
    } else {
      Comp();
    }
    expect(val).toBe(5);
  });

  it("updates value inside a component and reflects in next render", async () => {
    let val, setVal;
    const Comp = createComponent({
      render() {
        [val, setVal] = useState(1);
        return "<!-- test -->";
      },
    });
    if (Comp.mount) {
      Comp.mount(document.createElement("div"));
    } else {
      Comp();
    }
    setVal(2);
    // Re-render to get updated value
    await Promise.resolve();
    expect(val).toBe(2);
  });
});
