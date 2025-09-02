import { createComponent } from "../lib/reactive-core.js";

test("can manually add Comp to get its id for data-comp attribute", () => {
  // Create a component but do not mount
  const Comp = createComponent(() => `<span>Manual</span>`);
  // Use .toString() to get the id before mount
  const compId = Comp.toString();
  // Should be a number (the id)
  expect(typeof compId).toBe("string");

  // Use the id in markup
  const html = `<div data-comp="${compId}"></div>`;
  document.body.innerHTML = html;
  const el = document.body.querySelector(`[data-comp='${compId}']`);
  expect(el).not.toBeNull();
  expect(el.getAttribute("data-comp")).toBe(String(compId));
});

test("parent can render child placeholder with data-comp id from toString", () => {
  // Create child component
  const Child = createComponent(() => `<span>Child</span>`);
  const childId = Child.toString();

  // Parent renders a placeholder with child's id
  const Parent = createComponent(() => `<div data-comp='${childId}'></div>`);
  const container = document.createElement("div");
  Parent.mount(container);

  // The parent should render the placeholder div with correct id
  const placeholder = container.querySelector(`[data-comp='${childId}']`);
  expect(placeholder).not.toBeNull();
  expect(placeholder.getAttribute("data-comp")).toBe(String(childId));

  // Optionally, check that Child can be mounted into the placeholder
  Child.mount(placeholder);
  expect(placeholder.innerHTML).toContain("Child");
});
