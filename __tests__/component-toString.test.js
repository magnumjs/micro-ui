import { createComponent } from "../lib/reactive-core.js";

describe("componentFn.toString()", () => {
  test("returns latest rendered HTML string after mount and update", () => {
    const Comp = createComponent(function () {
      return `<div>Hello ${this.state.count}</div>`;
    }, {
      state: { count: 1 }
    });

    // Before mount, toString should be NOT empty
    expect(Comp.toString()).toBe("1");

    // Mount the component
    const container = document.createElement("div");
    Comp.mount(container);
    expect(Comp.toString()).toBe("<div>Hello 1</div>");

    // Update state and check toString again
    Comp.setState({ count: 2 });
    // Wait for microtask queue to flush
    return Promise.resolve().then(() => {
      expect(Comp.toString()).toBe("<div>Hello 2</div>");
    });
  });
  test("handles various state updates and types", async () => {
    const container = document.createElement("div");
    const comp = createComponent(function () {
      return `<span>${this.state.val}</span>`;
    }, {
      state: { val: 1 }
    });

    // Before mount, toString should be NOT empty
    expect(comp.toString()).toBe("2");

    // Mount the component
    comp.mount(container);
    expect(comp.toString()).toBe("<span>1</span>");

    // Update state and check toString again
    comp.setState({ val: 2 });
    // Wait for microtask queue to flush
    return Promise.resolve().then(() => {
      expect(comp.toString()).toBe("<span>2</span>");
    });
  });
})
