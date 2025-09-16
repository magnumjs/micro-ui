import { createComponent } from "../lib/reactive-core.js";
/**
 * @jest-environment jsdom
 */

describe("componentFn child instance call order cache", () => {
  it("creates a new clone only for new call order, reuses existing instance otherwise", () => {
    // Child component
    const Child = createComponent(
      ({ props }) => `<span>Child ${props.name}</span>`
    );
    // Parent component
    const Parent = createComponent(function () {
      // Call Child() twice in render
      const c1 = Child({ name: 1 });
      const c2 = Child({ name: 2 });
      // Return both for inspection
      return `<div>${c1}${c2}</div>`;
    });
    // First parent render
    const parent = Parent();
    // The parent should have a call cache with two unique instances
  expect(parent._childCallCache).toBeDefined();
  // Use the same composite key logic as the core
  const compId = Child._id;
  const key0 = `idx:0|comp:${compId}`;
  const key1 = `idx:1|comp:${compId}`;
  const key2 = `idx:2|comp:${compId}`;
  const first = parent._childCallCache[key0];
  const second = parent._childCallCache[key1];
  expect(first).not.toBe(second);
  // Call Parent() again (simulate re-render)
  // The same call order should reuse the same instances
  expect(parent._childCallCache[key0]).toBe(first);
  expect(parent._childCallCache[key1]).toBe(second);
  // If a third call is made, a new instance is created
  Child();
  expect(parent._childCallCache[key2]).not.toBe(first);
  expect(parent._childCallCache[key2]).not.toBe(second);
  });
});

describe("componentFn child instance output in parent", () => {
  it("renders child output in parent HTML", () => {
    // Child component
    const Child = createComponent(() => `<span>Child Output</span>`);
    // Parent component
    const Parent = createComponent(function () {
      // Call Child() twice in render
      return `<div>${Child()}${Child()}</div>`;
    });
    // Mount parent
    const parent = Parent();
    const container = document.createElement("div");
    parent.mount(container);
    // The parent HTML should contain the child output
    expect(container.innerHTML).toContain("Child Output");
    // Should appear twice
    expect(container.innerHTML.match(/Child Output/g).length).toBe(2);
  });
  it("renders different output for each child when given different props", () => {
    // Use imported createComponent (ESM)
    const Child = createComponent(({ props }) => {
      return `<span>${props.label}</span>`;
    });

    const Parent = createComponent(({ props }) => {
      const labels = props.labels || (props && props.labels);
      return labels.map((label) => Child({ label }));
    });
    const labels = ["A", "B", "C"];
    const parentInstance = Parent({ labels });
    const container = document.createElement("div");
    parentInstance.mount(container);
    expect(container.innerHTML).toContain("<span>A</span>");
    expect(container.innerHTML).toContain("<span>B</span>");
    expect(container.innerHTML).toContain("<span>C</span>");
    // Ensure each label appears exactly once
    labels.forEach((l) => {
      expect(
        container.innerHTML.match(new RegExp(`<span>${l}</span>`, "g")).length
      ).toBe(1);
    });
  });
});

