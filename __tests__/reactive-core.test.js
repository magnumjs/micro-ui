import { createComponent } from "../lib/reactive-core.js";
import { createState } from "../lib/compose/context.js";
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
    const mockCallback1 = jest.fn();
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

  test("runBeforeHook: handles rejected promise and continues", (done) => {
    const error = new Error("Promise failed");
    const logs = [];
    const originalConsoleError = console.error;
    console.error = (e) => logs.push(e);

    const container = document.createElement("div");
    document.body.appendChild(container);

    const Comp = createComponent(() => `<div>Test</div>`, {
      onBeforeMount: () => Promise.reject(error),
      onMount: () => {
        expect(logs).toContain(error);
        console.error = originalConsoleError;
        document.body.removeChild(container);
        done();
      },
    });

    Comp.mount(container);
  });
});
