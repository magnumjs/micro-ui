/**
 * @jest-environment jsdom
 */

import diffHTML, { patchChildren } from "../lib/diffHTML";
import { jest } from "@jest/globals";

function createEl(html) {
  const el = document.createElement("div");
  el.innerHTML = html;
  return el;
}

describe("diffHTML", () => {
  test("diffs elements without data-key by position, not by identity", () => {
    const el = document.createElement("div");
    el.innerHTML = `<div>A</div><div>B</div>`;
    // New HTML swaps the order
    const htmlSwapped = `<div>B</div><div>A</div>`;
    diffHTML(el, htmlSwapped);
    // Should update by position, not by identity
    expect(el.children.length).toBe(2);
    expect(el.firstChild.textContent).toBe("B");
    expect(el.lastChild.textContent).toBe("A");
  });
  test("component with default prop.key is assigned data-key and diffs based on key vs no key", () => {
    // Simulate a component with a default prop.key
    const key = "comp-123";
    // Initial render with data-key
    const el = document.createElement("div");
    el.innerHTML = `<div data-key="${key}">A</div>`;
    // New HTML with same key, should patch not replace
    const htmlSameKey = `<div data-key="${key}">B</div>`;
    diffHTML(el, htmlSameKey);
    const updated = el.querySelector(`[data-key='${key}']`);
    expect(updated.textContent).toBe("B");
    // New HTML with no key, should replace
    const htmlNoKey = `<div>C</div>`;
    diffHTML(el, htmlNoKey);
    expect(el.children.length).toBe(1);
    expect(el.firstChild.getAttribute("data-key")).toBeNull();
    expect(el.textContent).toBe("C");
  });
  test("uses data-key on the root element, not just children", () => {
    // Create a root element with data-key
    const el = document.createElement("div");
    el.setAttribute("data-key", "root-key");
    el.textContent = "OldRoot";
    // New HTML with same data-key but different content
    const html = '<div data-key="root-key">NewRoot</div>';
    diffHTML(el, html);
    // Should update the child element's content
    const updated = el.querySelector('[data-key="root-key"]');
    expect(updated).not.toBeNull();
    expect(updated.textContent).toBe("NewRoot");
  });
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
    const el = createEl(
      '<div data-key="x" class="old"><div data-key="y" class="old">Old</div></div>'
    );

    const html = `<span data-key="x" class="new"><span data-key="y" class="new">Hello</span></span>`;
    diffHTML(el, html);

    const updated = el.firstElementChild;
    expect(updated.tagName).toBe("SPAN");
    expect(updated.textContent).toBe("Hello");
  });

  test("patchNode: replaces keyed element when tagName differs", () => {
    const el = createEl(
      '<div data-key="x" class="old"><div data-key="y" class="old">Old</div></div>'
    );

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
describe("patchChildren", () => {
  // Helper to access patchChildren directly

  function createEl(html) {
    const el = document.createElement("div");
    el.innerHTML = html;
    return el;
  }

  test("removes extra child nodes when new has fewer", () => {
    const fromEl = createEl("<span>A</span><span>B</span>");
    const toEl = createEl("<span>A</span>");
    patchChildren(fromEl, toEl);
    expect(fromEl.childNodes.length).toBe(1);
    expect(fromEl.innerHTML).toBe("<span>A</span>");
  });

  test("adds child nodes when new has more", () => {
    const fromEl = createEl("<span>A</span>");
    const toEl = createEl("<span>A</span><span>B</span>");
    patchChildren(fromEl, toEl);
    expect(fromEl.childNodes.length).toBe(2);
    expect(fromEl.innerHTML).toBe("<span>A</span><span>B</span>");
  });

  test("patches text nodes", () => {
    const fromEl = createEl("Hello");
    const toEl = createEl("World");
    patchChildren(fromEl, toEl);
    expect(fromEl.textContent).toBe("World");
  });

  test("skips removal of nodes with data-comp-root", () => {
    const fromEl = createEl('<span data-comp-root="true">A</span>');
    const toEl = createEl("");
    patchChildren(fromEl, toEl);
    expect(fromEl.childNodes.length).toBe(1);
    expect(fromEl.firstChild.getAttribute("data-comp-root")).toBe("true");
  });
});
