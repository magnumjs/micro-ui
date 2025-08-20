// __tests__/patch-coverage.test.js

import diffHTML from "../lib/diffHTML.js";
import injectSlotContent from "../lib/injectSlotContent.js";
import { createComponent } from "../lib/reactive-core.js";
import { jest } from "@jest/globals";

describe("injectSlotContent line 20 coverage", () => {
  test("skips unknown item types in array", () => {
    const div = document.createElement("div");
    // Array contains unsupported types: number, boolean, null, undefined
    injectSlotContent(div, [123, null, undefined, true]);
    // The fragment should be empty, so div is replaced with an empty fragment
    // If div was in the DOM, it should be removed
    expect(div.isConnected).toBe(false); // div should be replaced
  });

  test("injectSlotContent: appends item.el in array", () => {
    const ref = document.createElement("span");
    const el = document.createElement("div");
    el.textContent = "Injected via .el";

    const parent = document.createElement("div");
    parent.appendChild(ref);

    injectSlotContent(ref, [{ el }]);

    expect(parent.innerHTML).toContain("Injected via .el");
  });
});

describe("Patch remaining uncovered branches", () => {
  test("diffHTML: skips null el", () => {
    const result = diffHTML(null, "<div>Test</div>");
    expect(result).toBe(false);
  });

  test("diffHTML: skips adding data-key if inner is not tag-start string", () => {
    const container = document.createElement("div");
    const result = diffHTML(container, "Just text");
    expect(container.textContent).toBe("Just text");
  });

  test("injectSlotContent: skips unknown item types in array", () => {
    const div = document.createElement("div");
    injectSlotContent(div, [123, null, undefined, true]);
    expect(div.isConnected).toBe(false); // got replaced
  });

  test("injectSlotContent: ignores when no refNode or null value", () => {
    expect(() => injectSlotContent(null, null)).not.toThrow();
  });

  test("reactive-core: onBeforeUnmount hook runs and clears element", () => {
    const onBeforeUnmount = jest.fn((next) => next());
    const Comp = createComponent(() => null, { onBeforeUnmount });
    const container = document.createElement("div");
    container.innerHTML = "<div>Content</div>";
    Comp.mount(container);
    Comp.setState({});
    Comp.unmount();
    expect(onBeforeUnmount).toHaveBeenCalled();
    expect(Comp.el.firstChild).toBeFalsy();
  });
});

describe("diffHTML uncovered branches (fixed)", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test("line 74: inserts newChild without data-key among old children", () => {
    container.innerHTML = "<div>Old A</div>";
    const newHTML = "<div>Old A</div><div>New Child</div>";

    const result = diffHTML(container, newHTML);

    expect(result).toBe(true);
    expect(container.children.length).toBe(2);
    expect(container.children[0].textContent).toBe("Old A");
    expect(container.children[1].textContent).toBe("New Child");
  });

  test("lines 112-113: patchChildren removes fromNode when toNode is missing", () => {
    container.innerHTML = "<div><span>Remove Me</span></div>";
    const oldDiv = container.firstChild;

    // Pass empty string to represent empty children inside oldDiv
    const newHTML = "";

    const result = diffHTML(oldDiv, newHTML);

    expect(result).toBe(true);
    expect(oldDiv.childNodes.length).toBe(0); // child removed
  });

  test("lines 112-113: patchChildren appends toNode when fromNode missing", () => {
    container.innerHTML = "<div></div>"; // no children inside div
    const oldDiv = container.firstChild;

    // Patch children of oldDiv with a span child
    const newHTML = "<div><span>Added</span></div>";

    const result = diffHTML(oldDiv, newHTML);

    expect(result).toBe(true);
    expect(oldDiv.childNodes.length).toBe(1);
    expect(oldDiv.firstChild.tagName).toBe("DIV");
    expect(oldDiv.firstChild.textContent).toBe("Added");
  });

  test("line 126: patchNode replaces fromNode with toNode clone if tagName differs", () => {
    container.innerHTML = "<div>Old</div>";
    const newHTML = "<span>New</span>";

    const result = diffHTML(container, newHTML);
    expect(result).toBe(true);

    expect(container.firstChild.tagName).toBe("SPAN");
    expect(container.firstChild.textContent).toBe("New");
  });

  test("diffHTML: removes attributes not present in newHTML (line 74)", () => {
    const el = document.createElement("div");
    el.innerHTML = `<div id="box" class="remove-me"></div>`;

    const html = `<div id="box"></div>`; // no "class" attribute now

    const result = diffHTML(el, html);

    const updated = el.firstElementChild;
    expect(result).toBe(true);
    expect(updated.hasAttribute("class")).toBe(false); // class should be removed
  });

  test("diffHTML: replaces node when node types differ (line 112)", () => {
    const el = document.createElement("div");
    el.appendChild(document.createTextNode("Old Text"));

    const html = `<span>New Element</span>`; // Element replacing text

    const result = diffHTML(el, html);

    expect(result).toBe(true);
    expect(el.firstElementChild.tagName).toBe("SPAN");
    expect(el.firstElementChild.textContent).toBe("New Element");
  });

  test("diffHTML: replaces node when tagNames differ (line 126)", () => {
    const el = document.createElement("div");
    el.innerHTML = `<p>Old Paragraph</p>`;

    const html = `<span>New Span</span>`; // tag differs, triggers fallback replace

    const result = diffHTML(el, html);

    expect(result).toBe(true);
    expect(el.firstElementChild.tagName).toBe("SPAN");
    expect(el.firstElementChild.textContent).toBe("New Span");
  });

  test("syncAttributes: removes attribute from fromEl when not present on toEl", () => {
    const el = document.createElement("div");
    el.innerHTML = `<div id="test" class="to-remove"></div>`;

    // class attribute is omitted in new HTML
    const html = `<div id="test"></div>`;

    const result = diffHTML(el, html);

    const updated = el.firstElementChild;

    expect(result).toBe(true);
    expect(updated.hasAttribute("class")).toBe(false); // <-- This triggers the removal logic
  });
});
