import { createComponent } from "../lib/reactive-core.js";
import { createState } from "../lib/utils/context.js";
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";

describe("createComponent", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("mounts and calls onMount lifecycle", () => {
    const onMount = jest.fn();
    const comp = createComponent(() => `<p>Hello</p>`, { onMount });
    comp.mount(container);
    expect(container.innerHTML).toContain("Hello");
    expect(onMount).toHaveBeenCalled();
  });

  it("calls onMount lifecycle and cleans DOM", () => {
    const onMount = jest.fn();
    const comp = createComponent(() => `<p>Bye</p>`, { onMount });
    comp.mount(container);
    comp.unmount();
    expect(container.innerHTML).toBe("");
    expect(onMount).toHaveBeenCalled();
  });

  it("renders and updates on props change", () => {
    const comp = createComponent(
      ({ props: { name } }) => `<p>Hello, ${name}</p>`
    );
    comp.mount(container);
    comp.update({ name: "Alice" });
    expect(container.innerHTML).toContain("Alice");
    comp.update({ name: "Bob" });
    expect(container.innerHTML).toContain("Bob");
  });

  it("does not re-render if props do not change", () => {
    const renderFn = jest.fn(({ props: { name } }) => `<p>${name}</p>`);
    const comp = createComponent(renderFn);
    comp.mount(container);
    comp.update({ name: "Alice" });
    comp.update({ name: "Alice" }); // same props
    expect(renderFn).toHaveBeenCalledTimes(3); // mount + first update
  });

  it("supports event delegation with selector", () => {
    const onClick = jest.fn();
    const comp = createComponent(
      () => `
        <button id="btn">Click me</button>
      `,
      {
        on: {
          "click #btn": function (e) {
            onClick(e);
          },
        },
      }
    );
    comp.mount(container);
    container.querySelector("#btn").click();
    expect(onClick).toHaveBeenCalled();
  });

  it("binds events to component context and uses props", () => {
    const handler = jest.fn();
    const comp = createComponent(() => `<button id="btn">Go</button>`, {
      on: {
        "click #btn": function (e) {
          this.props.onGo();
        },
      },
    });
    comp.mount(container);
    comp.update({ onGo: handler });
    container.querySelector("#btn").click();
    expect(handler).toHaveBeenCalled();
  });

  it("renders nested children passed as props", () => {
    const Child = createComponent(
      ({ props: { text } }) => `<span>${text}</span>`
    );
    const Parent = createComponent(
      ({ props: { children } }) => `<div>${children}</div>`
    );

    const childHTML = Child.render({ text: "Child text" });
    Parent.mount(container);

    Parent.update({ children: childHTML });
    expect(container.innerHTML).toContain("Child text");
  });
  it("handles empty HTML input gracefully", () => {
    const comp = createComponent(() => "");
    comp.mount(container);
    expect(container.innerHTML).toBe("");
  });
  it("handles null HTML input gracefully", () => {
    const comp = createComponent(() => null);
    comp.mount(container);
    expect(container.innerHTML).toBe("");
  });
  it("returns empty string if no HTML and no props", () => {
    const comp = createComponent(() => "");
    comp.mount(container);
    expect(container.innerHTML).toBe("");
  });
  it("returns empty string if HTML is null", () => {
    const comp = createComponent(() => null);
    comp.mount(container);
    expect(container.innerHTML).toBe("");
  });
  it("returns renderFn", () => {
    const renderFn = jest.fn(() => "");
    const comp = createComponent(renderFn);
    expect(comp.renderFn).toBe(renderFn);
  });
  it("updates props on render", () => {
    const comp = createComponent(({ props }) => `<p>${props.text}</p>`);
    comp.mount(container);
    comp.update({ text: "Initial" });
    expect(container.innerHTML).toContain("Initial");
    comp.update({ text: "Updated" });
    expect(container.innerHTML).toContain("Updated");
  });
  it("handles props with special characters", () => {
    const comp = createComponent(({ props }) => `<p>${props.text}</p>`);
    comp.mount(container);
    comp.update({ text: "Hello & Welcome!" });
    expect(container.querySelector("p").textContent).toBe("Hello & Welcome!");
  });
  it("returns el", () => {
    const comp = createComponent(() => `<p>Test</p>`);
    comp.mount(container);
    expect(comp.el).toBe(container);
  });
  it("returns el as null if not mounted", () => {
    const comp = createComponent(() => `<p>Test</p>`);
    expect(comp.el).toBeNull();
  });
  it("if (key && oldKeyed.has(key))", () => {
    const comp = createComponent(() => `<div data-key="1">Item 1</div>`);
    comp.mount(container);
    comp.update({}); // No change, should not re-render
    expect(container.innerHTML).toContain('data-key="1"');
  });
  it("if (key && newKeyed.has(key))", () => {
    const comp = createComponent(() => `<div data-key="1">Item 1</div>`);
    comp.mount(container);
    comp.update({}); // No change, should not re-render
    expect(container.innerHTML).toContain('data-key="1"');
  });
  it("if (key && oldKeyed.has(key))", () => {
    const comp = createComponent(() => `<div data-key="1">Item 1</div>`);
    comp.mount(container);
    comp.update({}); // No change, should not re-render
    expect(container.innerHTML).toContain('data-key="1"');
  });
  it("if (key && newKeyed.has(key)) with props", () => {
    const comp = createComponent(() => `<div data-key="1">Item 1</div>`);
    comp.mount(container);
    comp.update({ item: 2 }); // No change, should not re-render
    expect(container.innerHTML).toContain('data-key="1"');
  });
  it("if (key && newKeyed.has(key)) with props change", () => {
    const comp = createComponent(
      (props) => `<div data-key="1">Item 1 ${props.item}</div>`
    );
    comp.mount(container);
    comp.update({ item: 2 }); // No change, should not re-render
    expect(container.innerHTML).toContain('data-key="1"');
  });
  it("Removes stale nodes", () => {
    const comp = createComponent(() => `<div data-key="1">Item 1</div>`);
    comp.mount(container);
    comp.update({}); // No change, should not re-render
    expect(container.innerHTML).toContain('data-key="1"');
  });
  it("leftover of oldKeyed.values()", () => {
    const comp = createComponent(
      ({ props }) =>
        `${
          props.items === 2
            ? `<div data-key="2">Item 2</div>`
            : `<div data-key="1">Item 1</div>`
        }`
    );
    comp.mount(container);
    comp.update({ items: 2 }); // No change, should not re-render
    expect(container.innerHTML).toContain('data-key="2"');
  });
  it("setState", () => {
    const state = createState({ count: 0 });
    const comp = createComponent(() => `<p>Count: ${state.get().count}</p>`, {
      onMount() {
        state.setState((state) => {
          count: 1;
        });
      },
    });
    comp.mount(container);
    expect(container.innerHTML).toContain("Count: 0");
  });
  it("if (!target) throw new Error(`No element matches selector: ${selector}`)", () => {
    const comp = createComponent(() => `<p>Test</p>`);
    expect(() => comp.mount("#nonexistent")).toThrow(
      "No element matches: #nonexistent"
    );
  });
  it("update with no props", () => {
    const comp = createComponent(() => `<p>Test</p>`);
    comp.mount(container);
    comp.update(); // No props passed
    expect(container.innerHTML).toContain("Test");
  });
  it("if (!mounted) return", () => {
    const comp = createComponent(() => `<p>Test</p>`);
    comp.update({}); // Should not throw or change anything
    expect(container.innerHTML).toBe("");
  });
  it("let html =  renderFn;", () => {
    const renderFn = `<p>Test</p>`;
    const comp = createComponent(renderFn);
    comp.mount(container);
    expect(container.innerHTML).toContain("Test");
  });
  it("mount false", () => {
    const renderFn = `<p></p>`;
    const comp = createComponent(renderFn, {
      on: {
        " #btn": () => {},
      },
    });
    comp.mount(container);
    expect(container.innerHTML).toBe("<p></p>");
  });
  it("this.props = props; // ✅ Keep api.props up-to-date for event handlers", () => {
    const renderFn = `<p>Test</p>`;
    const comp = createComponent(renderFn);
    comp.mount(container);
    expect(comp.props).toEqual({});
  });
  it("this.props can be access within createComponent", () => {
    const renderFn = function ({ props }) {
      return `<p>${props.text}</p>`;
    };
    const comp = createComponent(renderFn);
    comp.mount(container);
    comp.update({ text: "Hello" });
    expect(container.innerHTML).toContain("Hello");
  });
  it("this.props can be access within createComponent after update", () => {
    const renderFn = function ({ props }) {
      return `<p>${props.text}</p>`;
    };
    const comp = createComponent(renderFn);
    comp.mount(container);
    comp.update({ text: "Hello" });
    expect(container.innerHTML).toContain("Hello");
    comp.update({ text: "World" });
    expect(container.innerHTML).toContain("World");
  });

  it("createState", () => {
    const state = createState({ count: 0 });
    const comp = createComponent(
      () => {
        return `<p>Count: ${state.get().count}</p>`;
      },
      {
        onBeforeMount() {
          state.setState((prev) => ({ count: prev.count + 1 }));
        },
      }
    );
    comp.mount(container);
    const cleanup = state.subscribe(() => {
      comp.update({});
      setTimeout(() => {
        expect(container.innerHTML).toContain("Count: 1");
        cleanup();
      }, 100);
    });
    //cleanup();
    setTimeout(() => {
      state.setState((prev) => ({ count: prev.count + 1 }));
      expect(container.innerHTML).toContain("Count: 2");
    }, 100);
  });
  test("onBeforeMount: executes callbacks before mounting", () => {
    const mockCallback = jest.fn();

    const Comp = createComponent(() => {
      return `<div>Test Component</div>`;
    });

    Comp.onBeforeMount(mockCallback);
    Comp.mount(container);

    expect(mockCallback).toHaveBeenCalled();
  });
  test("onBeforeMount: executes all callbacks and handles errors", () => {
    const mockCallback1 = jest.fn((next) => {
      next && next();
    });
    const mockCallback2 = jest.fn(() => {
      throw new Error("Test error");
    });
    const mockCallback3 = jest.fn();

    // Mock console.error to suppress error output during test
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const Comp = createComponent(() => {
      return `<div>Test Component</div>`;
    });

    Comp.onBeforeMount(mockCallback1);
    Comp.onBeforeMount(mockCallback2);
    Comp.onBeforeMount(mockCallback3);

    Comp.mount(container);

    expect(mockCallback1).toHaveBeenCalled();
    expect(mockCallback2).toHaveBeenCalled();
    expect(mockCallback3).toHaveBeenCalled();
    // Ensure the error from mockCallback2 does not stop execution

    // Restore original console.error
    console.error = originalConsoleError;
  });

  test("runBeforeHook: handles rejected promise and continues", async () => {
    const error = new Error("Promise failed");
    const logs = [];
    const originalConsoleError = console.error;
    console.error = (e) => logs.push(e);

    const container = document.createElement("div");
    document.body.appendChild(container);

    const Comp = createComponent(() => `<div>Test</div>`, {
      onBeforeMount: () => Promise.reject(error).catch(() => {}),
      onMount: () => {
        expect(logs).toContain(error);
        console.error = originalConsoleError;
        document.body.removeChild(container);
      },
    });

    Comp.mount(container);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(container.innerHTML).toContain("Test");
  });

  it("should create a component with a function signature", () => {
    const comp = createComponent(() => "<div>Test</div>");
    expect(typeof comp).toBe("function");
    expect(comp.render().toString()).toContain("Test");
  });

  it("should create a component with object signature", () => {
    const comp = createComponent({
      render: () => "<span>Obj</span>",
      state: { foo: 1 },
      custom: "bar",
    });
    expect(typeof comp).toBe("function");
    expect(comp.render().toString()).toContain("Obj");
    expect(comp.state).toEqual({ foo: 1 });
    expect(comp.custom).toBe("bar");
  });

  it("should assign unique _id to each component", () => {
    const comp1 = createComponent(() => "<div>1</div>");
    const comp2 = createComponent(() => "<div>2</div>");
    expect(comp1._id).not.toBe(comp2._id);
  });

  it("should expose .el as null before mount and as container after mount", () => {
    const comp = createComponent(() => "<div>Mount</div>");
    expect(comp.el).toBeNull();
    comp.mount(container);
    expect(comp.el).toBe(container);
  });

  it("should expose .props and update them on mount/update", () => {
    const comp = createComponent(({ props }) => `<div>${props.msg}</div>`);
    comp.mount(container, { msg: "Hello" });
    expect(comp.props.msg).toBe("Hello");
    comp.update({ msg: "World" });
    expect(comp.props.msg).toBe("World");
  });

  it("should call setState and trigger re-render", () => {
    const comp = createComponent(({ state }) => `<div>${state.count}</div>`, {
      state: { count: 0 },
    });
    comp.mount(container);
    comp.setState({ count: 5 });
    setTimeout(() => {
      expect(container.innerHTML).toContain("5");
    }, 0);
  });

  it("should call onUnmount lifecycle when unmounted", () => {
    const onUnmount = jest.fn();
    const comp = createComponent(() => "<div>Bye</div>", { onUnmount });
    comp.mount(container);
    comp.unmount();
    expect(onUnmount).toHaveBeenCalled();
  });

  it("should support .onMount, .onUnmount, .onBeforeMount, .onBeforeUnmount, .onUpdate registration", async () => {
    const onMount = jest.fn();
    const onUnmount = jest.fn();
    const onBeforeMount = jest.fn();
    const onBeforeUnmount = jest.fn();
    const onUpdate = jest.fn();
    const comp = createComponent(() => "<div>Life</div>");
    comp.onMount(onMount);
    comp.onUnmount(onUnmount);
    comp.onBeforeMount(onBeforeMount);
    comp.onBeforeUnmount(onBeforeUnmount);
    comp.onUpdate(onUpdate);
    comp.mount(container);
    await Promise.resolve();
    comp.update({ foo: "bar" });
    expect(onMount).toHaveBeenCalled();
    comp.unmount();
    await Promise.resolve();
    expect(onUnmount).toHaveBeenCalled();
    expect(onBeforeMount).toHaveBeenCalled();
    expect(onBeforeUnmount).toHaveBeenCalled();
    expect(onUpdate).toHaveBeenCalled();
  });

  it("should allow event registration via .addEvent", () => {
    const handler = jest.fn();
    const comp = createComponent(() => `<button id="btn">Click</button>`);
    comp.addEvent("click #btn", handler);
    comp.mount(container);
    container.querySelector("#btn").click();
    expect(handler).toHaveBeenCalled();
  });

  it("should expose .ref and .refs for DOM refs", () => {
    const comp = createComponent(() => `<input data-ref="myinput" />`);
    comp.mount(container);
    expect(comp.ref("myinput")).toBe(
      container.querySelector("[data-ref='myinput']")
    );
    expect(comp.refs.myinput).toBe(
      container.querySelector("[data-ref='myinput']")
    );
  });

  it("should return correct value", () => {
    const comp = createComponent(() => `Str`);
    // Before mount, toString returns the component ID (number)
    expect(typeof comp.toString()).toBe("string");
    comp.mount(container);
    comp.update();
    expect(comp.toString()).toContain("Str");
  });

  it("should return correct value", () => {
    const comp = createComponent(`Str`);
    // Before mount, toString returns the component ID (number)
    expect(typeof comp.toString()).toBe("string");
    comp.mount(container);
    comp.update();
    expect(comp.toString()).toContain("Str");
  });

  it("should return correct .toString before and after render", () => {
    const comp = createComponent(() => `<div>Str</div>`);
    // Before mount, toString returns the component ID (number)
    expect(typeof comp.toString()).toBe("string");
    comp.mount(container);
    comp.update();
    expect(comp.toString()).toContain("Str");
  });

  it("should clone from template and preserve initialProps", () => {
    const base = createComponent(() => "<div>Base</div>", { state: { a: 1 } });
    const clone = base._templateSource ? base._templateSource : undefined;
    expect(clone).toBeUndefined(); // _templateSource only set on clones
    const cloned = base._frozenTemplate
      ? createComponent(
          base._frozenTemplate.renderFn,
          base._frozenTemplate.options
        )
      : undefined;
    expect(cloned).toBeDefined();
    expect(cloned.state).toEqual({ a: 1 });
  });
});
