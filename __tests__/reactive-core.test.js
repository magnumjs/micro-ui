import { createState, createComponent } from "../lib/reactive-core.js";
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

  it("calls onDestroy lifecycle and cleans DOM", () => {
    const onDestroy = jest.fn();
    const comp = createComponent(() => `<p>Bye</p>`, { onDestroy });
    comp.mount(container);
    comp.destroy();
    expect(container.innerHTML).toBe("");
    expect(onDestroy).toHaveBeenCalled();
  });

  it("renders and updates on props change", () => {
    const comp = createComponent(({ name }) => `<p>Hello, ${name}</p>`);
    comp.mount(container);
    comp.update({ name: "Alice" });
    expect(container.innerHTML).toContain("Alice");
    comp.update({ name: "Bob" });
    expect(container.innerHTML).toContain("Bob");
  });

  it("does not re-render if props do not change", () => {
    const renderFn = jest.fn(({ name }) => `<p>${name}</p>`);
    const comp = createComponent(renderFn);
    comp.mount(container);
    comp.update({ name: "Alice" });
    comp.update({ name: "Alice" }); // same props
    expect(renderFn).toHaveBeenCalledTimes(2); // mount + first update
  });

  it("supports event delegation with selector", () => {
    const onClick = jest.fn();
    const comp = createComponent(
      () => `
        <button id="btn">Click me</button>
      `,
      {
        events: {
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
      events: {
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
    const Child = createComponent(({ text }) => `<span>${text}</span>`);
    const Parent = createComponent(({ children }) => `<div>${children}</div>`);

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
    const comp = createComponent((props) => `<p>${props.text}</p>`);
    comp.mount(container);
    comp.update({ text: "Initial" });
    expect(container.innerHTML).toContain("Initial");
    comp.update({ text: "Updated" });
    expect(container.innerHTML).toContain("Updated");
  });
  it("handles props with special characters", () => {
    const comp = createComponent((props) => `<p>${props.text}</p>`);
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
  it('if (key && oldKeyed.has(key))', () => {
    const comp = createComponent(() => `<div data-key="1">Item 1</div>`);
    comp.mount(container);
    comp.update({}); // No change, should not re-render
    expect(container.innerHTML).toContain('data-key="1"');
  } );
  it('if (key && newKeyed.has(key))', () => {
    const comp = createComponent(() => `<div data-key="1">Item 1</div>`);
    comp.mount(container);
    comp.update({}); // No change, should not re-render
    expect(container.innerHTML).toContain('data-key="1"');
  });
  it('if (key && oldKeyed.has(key))', () => {
    const comp = createComponent(() => `<div data-key="1">Item 1</div>`);
    comp.mount(container);
    comp.update({}); // No change, should not re-render
    expect(container.innerHTML).toContain('data-key="1"');
  });
  it('if (key && newKeyed.has(key)) with props', () => {
    const comp = createComponent(() => `<div data-key="1">Item 1</div>`);
    comp.mount(container);
    comp.update({item: 2}); // No change, should not re-render
    expect(container.innerHTML).toContain('data-key="1"');
  });
    it('if (key && newKeyed.has(key)) with props change', () => {
    const comp = createComponent((props) => `<div data-key="1">Item 1 ${props.item}</div>`);
    comp.mount(container);
    comp.update({item: 2}); // No change, should not re-render
    expect(container.innerHTML).toContain('data-key="1"');
  });
  it('Removes stale nodes', () => {
    const comp = createComponent(() => `<div data-key="1">Item 1</div>`);
    comp.mount(container);
    comp.update({}); // No change, should not re-render
    expect(container.innerHTML).toContain('data-key="1"');
  });
  it('leftover of oldKeyed.values()', () => {
    const comp = createComponent((props) => `${props.items ===2 ? `<div data-key="2">Item 2</div>` : `<div data-key="1">Item 1</div>`}`);
    comp.mount(container);
    comp.update({items: 2}); // No change, should not re-render
    expect(container.innerHTML).toContain('data-key="2"');
  });
  it('setState', () => {
    const state = createState({ count: 0 });
    const comp = createComponent(() => `<p>Count: ${state.get().count}</p>`, {
      onMount() {
        state.setState(state => { count: 1 });
      },
    });
    comp.mount(container);
    expect(container.innerHTML).toContain("Count: 0");
  });
  it('if (!target) throw new Error(`No element matches selector: ${selector}`)', () => {
    const comp = createComponent(() => `<p>Test</p>`);
    expect(() => comp.mountTo("#nonexistent")).toThrow(
      "No element matches selector: #nonexistent"
    );
  });
  it('update with no props', () => {
    const comp = createComponent(() => `<p>Test</p>`);
    comp.mount(container);
    comp.update(); // No props passed
    expect(container.innerHTML).toContain("Test");
  });
  it('if (!mounted) return', () => {
    const comp = createComponent(() => `<p>Test</p>`);
    comp.update({}); // Should not throw or change anything
    expect(container.innerHTML).toBe("");
  });
  it('let html =  renderFn;', () => {
    const renderFn = `<p>Test</p>`;
    const comp = createComponent(renderFn);
    comp.mount(container);
    expect(container.innerHTML).toContain("Test");
  });
  it('mount false', () => {
    const renderFn = `<p></p>`;
    const comp = createComponent(renderFn, {
      events: {
        " #btn": () => {},
      },
    });
    comp.mount(container); 
    expect(container.innerHTML).toBe("<p></p>");
  });
it('this.props = props; // ✅ Keep api.props up-to-date for event handlers', () => {
    const renderFn = `<p>Test</p>`;
    const comp = createComponent(renderFn);
    comp.mount(container);
    expect(comp.props).toEqual({});
  });
  it('this.props can be access within createComponent', () => {
    const renderFn = function() {
      return `<p>${this.props.text}</p>`;
    };
    const comp = createComponent(renderFn);
    comp.mount(container);
    comp.update({ text: "Hello" });
    expect(container.innerHTML).toContain("Hello");
  });
  it('this.props can be access within createComponent after update', () => {
    const renderFn = function() {
      return `<p>${this.props.text}</p>`;
    }
    const comp = createComponent(renderFn);
    comp.mount(container);    
    comp.update({ text: "Hello" });    
    expect(container.innerHTML).toContain("Hello");    
    comp.update({ text: "World" });    
    expect(container.innerHTML).toContain("World");    
  });
  

});
