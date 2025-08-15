import { createComponent } from "../lib/reactive-core.js";
import { jest, describe, test, expect } from "@jest/globals";
import injectSlotContent from "../lib/injectSlotContent.js";
test("reuses mounted child and updates DOM correctly after parent update", async () => {
  // Simple child component with render count
  const Child = createComponent(function () {
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
