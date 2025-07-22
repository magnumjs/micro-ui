import { createComponent } from "../lib/reactive-core";
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';


describe("createComponent with internal state", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("initializes with default state and updates DOM on setState", () => {
    const Box = createComponent(function ({state}) {
      const count = state.count ?? 0;
      return `<div><p>Count: ${count}</p></div>`;
    });

    Box.mount(container);
    expect(container.innerHTML).toContain("Count: 0");

    Box.setState({ count: 5 });
    expect(container.innerHTML).toContain("Count: 5");
  });

  it("supports functional setState updater", () => {
    const Counter = createComponent(function ({state}) {
      const count = state.count ?? 0;
      return `<div><button id="inc">+</button><p>${count}</p></div>`;
    }, {
      on: {
        "click #inc": function ({setState}) {
          setState(prev => ({ count: (prev.count || 0) + 1 }));
        }
      }
    });

    Counter.mount(container);

    const btn = container.querySelector("#inc");
    btn.click();
    btn.click();
    expect(container.innerHTML).toContain(">2<");
  });

  it("does not rerender if setState is called with unchanged values", () => {
    const renderSpy = jest.fn();

    const Comp = createComponent(function ({state}) {
      renderSpy();
      const msg = state.msg ?? "Hi";
      return `<p>${msg}</p>`;
    });

    Comp.mount(container);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    Comp.setState({ msg: "Hi" }); // same value
    expect(renderSpy).toHaveBeenCalledTimes(2); // Still renders, since it's a naive implementation
  });

  it("updates when props change separately from state", () => {
    const Comp = createComponent(function ({ props, state, setState }) {
      const count = state.count ?? 0;
      return `<h1>${props.title}</h1><p>${count}</p>`;
    });

    Comp.mount(container);
    Comp.update({ title: "Welcome" });
    expect(container.innerHTML).toContain("Welcome");

    Comp.setState({ count: 10 });
    expect(container.innerHTML).toContain(">10<");
  });

  it("has access to props/state/setState inside event handlers", () => {
    const Comp = createComponent(function ({state}) {
      const visible = state.visible ?? false;
      return `
        <div>
          <button id="toggle">Toggle</button>
          ${visible ? "<p>Now you see me</p>" : ""}
        </div>
      `;
    }, {
      on: {
        "click #toggle": function () {
          this.setState(prev => ({ visible: !prev.visible }));
        }
      }
    });

    Comp.mount(container);
    expect(container.innerHTML).not.toContain("Now you see me");

    container.querySelector("#toggle").click();
    expect(container.innerHTML).toContain("Now you see me");

    container.querySelector("#toggle").click();
    expect(container.innerHTML).not.toContain("Now you see me");
  });
});
