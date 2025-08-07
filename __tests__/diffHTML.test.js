/**
 * @jest-environment jsdom
 */

import diffHTML from "../lib/diffHTML";

function createEl(html) {
  const el = document.createElement("div");
  el.innerHTML = html;
  return el;
}

describe("diffHTML", () => {
  test("returns false if el is null", () => {
    expect(diffHTML(null, "<div></div>")).toBe(false);
  });

  test("adds new elements", () => {
    const el = createEl("");
    const html = '<div data-key="1">A</div><div data-key="2">B</div>';
    const result = diffHTML(el, html);
    expect(result).toBe(true);
    expect(el.children.length).toBe(2);
    expect(el.innerHTML).toContain("A");
    expect(el.innerHTML).toContain("B");
  });

  test("removes old elements with no matching keys", () => {
    const el = createEl('<div data-key="x">Old</div>');
    const html = '<div data-key="y">New</div>';
    diffHTML(el, html);
    expect(el.children.length).toBe(1);
    expect(el.innerHTML).toContain("New");
  });

  test("moves elements based on keys", () => {
    const el = createEl(
      '<div data-key="1">One</div><div data-key="2">Two</div>'
    );
    const html = '<div data-key="2">Two</div><div data-key="1">One</div>';
    diffHTML(el, html);
    expect(el.firstChild.dataset.key).toBe("2");
    expect(el.lastChild.dataset.key).toBe("1");
  });

  test("updates attributes and text content", () => {
    const el = createEl('<div data-key="1" class="old">Old</div>');
    const html = '<div data-key="1" class="new">Newish</div>';
    diffHTML(el, html);
    const updated = el.querySelector("[data-key='1']");
    expect(updated.className).toBe("new");
    expect(updated.textContent).toBe("Newish");
  });

  test("updates attributes and text content", () => {
    const el = createEl('<div data-key="1" class="old">Old</div>');
    const html = '<div data-key="1" class="new"><span>Newish</span></div>';
    diffHTML(el, html);
    const updated = el.querySelector("[data-key='1']");
    expect(updated.className).toBe("new");
    expect(updated.textContent).toBe("Newish");
  });

  test("patchNode: replaces keyed element when tagName differs", () => {
    const el = createEl('<div data-key="x" class="old"><div data-key="y" class="old">Old</div></div>');

    const html = `<span data-key="x" class="new"><span data-key="y" class="new">Hello</span></span>`;
    diffHTML(el, html);

    const updated = el.firstElementChild;
    expect(updated.tagName).toBe("SPAN");
    expect(updated.textContent).toBe("Hello");
  });

  test("patchNode: replaces keyed element when tagName differs", () => {
    const el = createEl('<div data-key="x" class="old"><div data-key="y" class="old">Old</div></div>');

    const html = `<div data-key="x" class="new"><span data-key="y" class="new">Hello</span></span>`;
    diffHTML(el, html);

    const updated = el.firstElementChild;
    expect(updated.tagName).toBe("DIV");
    expect(updated.textContent).toBe("Hello");
  });

  test("updates attributes and text content", () => {
    const el = createEl('<div data-key="1" class="old">Old</div>');
    const html = '<div data-key="1"><b>Newish</b></div>';
    diffHTML(el, html);
    const updated = el.querySelector("[data-key='1']");
    expect(updated.className).toBe("");
    expect(updated.textContent).toBe("Newish");
  });

  test("patches text node value", () => {
    const el = createEl("Hello");
    const html = "World";
    diffHTML(el, html);
    expect(el.textContent).toBe("World");
  });

  test("removes excess children", () => {
    const el = createEl(
      '<div data-key="1">A</div><div data-key="2">B</div><div data-key="3">C</div>'
    );
    const html = '<div data-key="1">A</div>';
    diffHTML(el, html);
    expect(el.children.length).toBe(1);
    expect(el.innerHTML).toContain("A");
  });

  test("handles nodes without keys", () => {
    const el = createEl("<span>Hi</span>");
    const html = "<span>Hello</span>";
    diffHTML(el, html);
    expect(el.innerHTML).toContain("Hello");
  });

  test("replaces nodes with different types", () => {
    const el = createEl("<div>Box</div>");
    const html = "<p>Paragraph</p>";
    diffHTML(el, html);
    expect(el.innerHTML).toContain("Paragraph");
  });

  test("patches deeply nested children", () => {
    const el = createEl("<div><span>Old</span></div>");
    const html = "<div><span>New3434</span></div>";
    diffHTML(el, html);
    expect(el.innerHTML).toContain("New3434");
  });

  test("patches diff node types", () => {
    const el = createEl("<div><span data-ref='test'>Old</span></div>");
    const html =
      "<div><span><b>New</b></span></div><div><span>New</span></div>";
    diffHTML(el, html);
    expect(el.innerHTML).toContain("New");
  });
});
