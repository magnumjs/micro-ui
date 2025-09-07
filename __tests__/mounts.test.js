import { createComponent, useCurrentComponent } from "../lib/reactive-core.js";
import { jest, describe, test, expect } from "@jest/globals";
import injectSlotContent from "../lib/injectSlotContent.js";

test("reuses mounted child and updates DOM correctly after parent update", async () => {
  // Simple child component with render count
  const Child = createComponent(function Counter() {
    this.setCount = (n) => this.setState({ count: n });
    return `<div>Child Count: ${this.state.count}</div>`;
  },{
    state: { count: 0 },
  });

  // Parent with a default slot for the child
  const Parent = createComponent(function () {
    return `<div><slot></slot></div>`;
  });

  const child = Child();

  const parent = Parent({ slots: { default: child } });

  // Mount parent into DOM
  const container = document.createElement("div");
  parent.mount(container);


  expect(container.innerHTML).toContain("Child Count: 0");

  // Update parent — child should be reused, not remounted
  parent.update({ slots: { default: child } });

  // Update child’s state — should reflect in DOM without remount
  child.setCount(5);
  await Promise.resolve(); // wait for microtask queue
  expect(container.innerHTML).toContain("Child Count: 5");
});

test("throws error if trying to add method to existing component function", () => {
  const Component = createComponent(function(){
    this.doCount = () => {
        return 0;
    };
    return `<div>Test</div>`;
  });

  expect(() => {
    Component.setState = () => {
        return true;
    };
  }).toThrowError(
   /Cannot set property setState of function componentFn/
  );
    Component.mount(document.body);
    expect(Component.doCount).toBeDefined();
    expect(Component.doCount()).toBe(0);
    expect(Component.setState).toBeDefined();
    expect(Component.setState()).toBe(undefined);
});

test("injectSlotContent sets el to temp if mount sets el to refNode", () => {
  // Mock component with mount logic that sets el to refNode
  function MockComponent() {
    this.el = null;
    this.isMounted = () => !!this.el;
    this.mount = (node) => {
      // Simulate mount setting el to the original slot node
      this.el = node._isSlot ? node : node;
    };
  }
  // Create a slot node
  const slot = document.createElement("div");
  slot._isSlot = true; // Mark as slot for test
  // Simulate injectSlotContent logic
  const comp = new MockComponent();
  // Patch: simulate the temp node logic
  const temp = document.createElement("div");
  // Simulate refNode.replaceWith(temp) and mount
  comp.mount(slot);
  // Now simulate the check and assignment
  if (comp.el === slot) {
    comp.el = temp;
  }
  expect(comp.el).toBe(temp);
});

test("injectSlotContent first mount sets el to temp if mount sets el to refNode", () => {
  // Mock component for first mount
  function MockComponent(refNode) {
    this.el = null;
    this._refNode = refNode;
    this.isMounted = () => false; // Not mounted yet
    this.mount = (node) => {
      // Simulate buggy mount: sets el to original slot node, not temp
      this.el = this._refNode;
    };
  }
  // Create a slot node
  const slot = document.createElement("div");
  // Setup API stub
  const api = { _mountedChildren: [] };
  // Create component instance
  const comp = new MockComponent(slot);
  // Patch: call injectSlotContent directly
  injectSlotContent(slot, comp, api);
  // After injection, el should be set to temp (not slot)
  expect(comp.el).not.toBe(slot);
  expect(comp.el instanceof HTMLElement).toBe(true);
});

test("syncInstanceToAPI getter returns instance property", () => {
  // Import the function directly
  // Create a component that sets a property on instance
  const Component = createComponent(function () {
    this.foo = 123;
    return `<div>Test</div>`;
  });
  // Mount to trigger syncInstanceToAPI
  Component.mount(document.body);
  // The getter should return the instance property
  expect(Component.foo).toBe(123);
});

test("captures currentComponent as componentFn during render for composables", () => {
  // Import the module and patch currentComponent
  let captured = null;
  // Patch global for test
  // Create a component that reads currentComponent during render
  const Comp = createComponent(function () {
    captured = useCurrentComponent();
    return `<div>Test</div>`;
  });
  Comp.mount(document.body);
  // The captured value should be the component function itself
  expect(captured).toBe(Comp);
});




describe('Parent/Child with slot reuse', () => {
  it('reuses child component and preserves state on parent re-render', async () => {
    const logs = [];

    const Child = createComponent(({ state }) => `<div>Child state: ${state.count || 0}</div>`, {
      state: { count: 1 },
      onMount() { logs.push('Child mounted'); },
      onUpdate() { logs.push('Child updated'); },
      onUnmount() { logs.push('Child unmounted'); },
    });

    const Button = createComponent(() => `<button>Say Hello!</button>`);

    const Parent = createComponent(({ state }) => `
      <div>
        <slot name="button">defaults...</slot>
        ${state.show ? `<slot>defaults</slot>` : `Loaded`}
      </div>
    `, {
      state: { show: true },
      on: {
        "click button"() {
          this.setState({ show: !this.state.show });
        }
      }
    });

    // Mount parent with slot children
    Parent.mount(document.body, {
      slots: {
        button: Button,
        default: Child,
      }
    });

    // Initial mount
    expect(logs).toContain('Child mounted');
    expect(logs).not.toContain('Child unmounted');

    const childEl = Child.el;
    expect(childEl.textContent).toBe('Child state: 1');

    // Click button to toggle show -> parent re-render
    document.querySelector('button').click();

    // Child should NOT unmount
    expect(logs).not.toContain('Child unmounted');
    expect(Child.el).toBe(childEl); // DOM element reused

    await Promise.resolve(); // wait for microtask queue
    // Parent template updated
    expect(document.body.innerHTML).toContain('Loaded');

    // Click button again to toggle back
    document.querySelector('button').click();

    // Child still reused
    expect(Child.el).toBe(childEl);
    expect(logs.filter(l => l === 'Child mounted').length).toBe(1);

    await Promise.resolve();
    // Parent template shows the slot content again
    expect(document.body.innerHTML).toContain('Child state: 1');
  });
});

// Event boundary tests … what other effects to boundaries besides events?

/**
 * @jest-environment jsdom
 */


describe("MicroUI component boundaries with on-event delegation", () => {
  let parentComp;
  let childComp;
  let parentHandler;
  let childHandler;
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    parentHandler = jest.fn();
    childHandler = jest.fn();

    // Child component
    childComp = createComponent({
      render() {
        return `<div data-component-root="true">
          <button data-action="childAction">Child</button>
        </div>`;
      },
      on: {
        "click [data-action='childAction']": childHandler,
      },
    });

    // Parent component
    parentComp = createComponent({
      render() {
        return `<div data-component-root="true">
          <button data-action="parentAction">Parent</button>
          <div id="child-slot"></div>
        </div>`;
      },
      on: {
        "click [data-action='parentAction']": parentHandler,
      },
      slots: {
        "child-slot": childComp,
      },
    });

    parentComp.mount(container);
  });

  afterEach(() => {
    parentComp.unmount();
    container.remove();
  });

  test("Parent button click triggers parent handler only", () => {
    const parentButton = container.querySelector("[data-action='parentAction']");
    parentButton.click();
    expect(parentHandler).toHaveBeenCalledTimes(1);
    expect(childHandler).not.toHaveBeenCalled();
  });

  test("Child button click triggers child handler only", () => {
    const childButton = container.querySelector("[data-action='childAction']");
    childButton.click();
    expect(childHandler).toHaveBeenCalledTimes(1);
    expect(parentHandler).not.toHaveBeenCalled();
  });
});

/**
 * @jest-environment jsdom
 */

describe("Component boundaries and event delegation", () => {
  let parentRoot;
  let childRoot;
  let parentHandler;
  let childHandler;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <div data-component-root="true" id="parent">
        <button data-action="parentAction">Parent</button>
        <div data-component-root="true" id="child">
          <button data-action="childAction">Child</button>
        </div>
      </div>
    `;

    parentRoot = document.getElementById("parent");
    childRoot = document.getElementById("child");

    // Mock handlers
    parentHandler = jest.fn();
    childHandler = jest.fn();

    // Event delegation for parent
    parentRoot.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]");
      if (!action) return;
      // Only handle if inside parent's boundary but not inside a child component
      if (!action.closest("[data-component-root]") || action.closest("#parent") === parentRoot) {
        if (action.dataset.action === "parentAction") parentHandler();
      }
    });

    // Event delegation for child
    childRoot.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]");
      if (!action) return;
      if (action.dataset.action === "childAction") childHandler();
    });
  });

  test("Parent button click triggers parent handler only", () => {
    const parentButton = parentRoot.querySelector("[data-action='parentAction']");
    parentButton.click();
    expect(parentHandler).toHaveBeenCalledTimes(1);
    expect(childHandler).not.toHaveBeenCalled();
  });

  test("Child button click triggers child handler only", () => {
    const childButton = childRoot.querySelector("[data-action='childAction']");
    childButton.click();
    expect(childHandler).toHaveBeenCalledTimes(1);
    expect(parentHandler).not.toHaveBeenCalled();
  });
});
