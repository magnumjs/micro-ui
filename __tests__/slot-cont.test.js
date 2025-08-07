/**
 * @jest-environment jsdom
 */

import injectSlotContent from "../lib/injectSlotContent.js";

function createRef() {
  const container = document.createElement("div");
  const placeholder = document.createElement("span");
  placeholder.setAttribute("data-ref", "slot");
  container.appendChild(placeholder);
  document.body.appendChild(container);
  return placeholder;
}

test("does nothing if refNode is null", () => {
  expect(() => injectSlotContent(null, "Hello")).not.toThrow();
});

test("does nothing if value is null", () => {
  const ref = createRef();
  expect(() => injectSlotContent(ref, null)).not.toThrow();
});

test("injects single string", () => {
  const ref = createRef();
  injectSlotContent(ref, "<b>Hello</b>");
  expect(document.body.innerHTML).toContain("<b>Hello</b>");
});

test("injects single DOM node", () => {
  const ref = createRef();
  const div = document.createElement("div");
  div.textContent = "World";
  injectSlotContent(ref, div);
  expect(document.body.innerHTML).toContain("World");
});

test("injects resolved function value", () => {
  const ref = createRef();
  injectSlotContent(ref, () => "<i>Italic</i>");
  expect(document.body.innerHTML).toContain("<i>Italic</i>");
});

test("injects array of HTML strings", () => {
  const ref = createRef();
  injectSlotContent(ref, ["<b>Bold</b>", "<i>Italic</i>"]);
  expect(document.body.innerHTML).toContain("Bold");
  expect(document.body.innerHTML).toContain("Italic");
});

test("injects array of DOM nodes", () => {
  const ref = createRef();
  const span = document.createElement("span");
  span.textContent = "Node";
  injectSlotContent(ref, [span]);
  expect(document.body.innerHTML).toContain("Node");
});

test("injects component instance with .el", () => {
  const ref = createRef();
  const comp = { el: document.createElement("div") };
  comp.el.textContent = "Component";
  injectSlotContent(ref, comp);
  expect(document.body.innerHTML).toContain("Component");
});

test("injects component instance with .mount()", () => {
  const ref = createRef();
  const comp = {
    mount(target) {
      const el = document.createElement("h1");
      el.textContent = "Mounted";
      target.appendChild(el);
    }
  };
  injectSlotContent(ref, comp);
  expect(document.body.innerHTML).toContain("Mounted");
});

test("injects array of mixed types", () => {
  const ref = createRef();
  const comp = {
    mount(target) {
      const el = document.createElement("h2");
      el.textContent = "ArrayMount";
      target.appendChild(el);
    }
  };
  const span = document.createElement("span");
  span.textContent = "Inline";
  injectSlotContent(ref, ["<b>One</b>", span, comp]);
  expect(document.body.innerHTML).toContain("One");
  expect(document.body.innerHTML).toContain("Inline");
  expect(document.body.innerHTML).toContain("ArrayMount");
});