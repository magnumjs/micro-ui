import { createComponent } from "../lib/reactive-core.js";

describe("componentFn.toString()", () => {
  test("returns latest rendered HTML string after mount and update", () => {
    const Comp = createComponent(function () {
      return `<div>Hello ${this.state.count}</div>`;
    }, {
      state: { count: 1 }
    });

    // Before mount, toString should be empty
    expect(Comp.toString()).toBe("");

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
});
