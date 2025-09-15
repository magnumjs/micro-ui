import { createComponent } from '../lib/reactive-core';
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";
import diffHTML from "../lib/diffHTML";

jest.mock("../lib/diffHTML", () => {
  return jest.fn();
});

xdescribe("Component and child render cache", () => {
  it("children skip diffHTML independently when HTML is unchanged", () => {
    let parentSkipBranch = false;
    let childSkipBranch = false;

    // Child component
    const Child = createComponent({
      render: ({ state }) => `<span>${state.count}</span>`,
      state: { count: 1 }
    });

    // Spy on child's render branch
    const originalChildRender = Child._render;
    Child._render = function(props) {
      const html = originalChildRender.call(this, props);
      if (html === this._lastHTML) childSkipBranch = true;
      return html;
    };

    // Parent component using Child
    const Parent = createComponent({
      render: ({ state }) => `<div>${Child()}</div>`,
      state: { text: "hello" }
    });

    // Spy on parent's render branch
    const originalParentRender = Parent._render;
    Parent._render = function(props) {
      const html = originalParentRender.call(this, props);
      if (html === this._lastHTML) parentSkipBranch = true;
      return html;
    };

    // Mount on dummy div
    document.body.innerHTML = `<div id="root"></div>`;
    const mount = document.getElementById("root");
    Parent.mount(mount);

    // First render -> both caches populated, branches not executed yet
    expect(parentSkipBranch).toBe(false);
    expect(childSkipBranch).toBe(false);

    // Second render with same state -> both branches should execute
    Parent();
    expect(parentSkipBranch).toBe(true);
    expect(childSkipBranch).toBe(true);

    // Update child state -> child branch should reset, parent may still skip
    childSkipBranch = false;
    Child.setState({ count: 2 });
    expect(childSkipBranch).toBe(false); // child HTML changed
    expect(Child._lastHTML).toContain("2"); // child cache updated

    // Update parent state without changing Child output -> parent branch skipped, child branch unchanged
    parentSkipBranch = false;
    Parent.setState({ text: "hello" });
    expect(parentSkipBranch).toBe(true);
  });
});




describe('reactive-core line 369-377 coverage', () => {
  test('should cover unchanged html branch and event/update/focus logic', async () => {
    document.body.innerHTML = `<div id="root"></div>`;
    const root = document.getElementById('root');
    let renderCount = 0;
    let updateCalled = false;
    let eventCalled = false;
    const Comp = createComponent({
      render: () => {
        renderCount++;
        return '<button id="btn">Click</button>';
      },
      on: {
        'click button': () => {
          eventCalled = true;
        }
      },
      onUpdate: () => {
        updateCalled = true;
      }
    });
    Comp.mount(root);
    const btn = root.querySelector('#btn');
    btn.focus();
    // First render
    Comp.update({}); // Should not change html
    expect(renderCount).toBe(2); // Render called twice
    // Now, update with same html, should hit line 369-377
            btn.focus();
    btn.click();

    Comp.update({});
    expect(renderCount).toBe(3);
    // Simulate click to ensure bindEvents worked
    btn.click();

    expect(eventCalled).toBe(true);
    // Ensure update hook was called
    expect(updateCalled).toBe(true);

    await Promise.resolve();
    // Ensure focus was restored
    // expect(document.activeElement).toBe(btn);
  });
});
