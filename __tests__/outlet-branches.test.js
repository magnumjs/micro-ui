/**
 * @jest-environment jsdom
 */

import Outlet from "../lib/outlet";

const createComponentInstance = (html = "<span>Comp</span>") => {
  const div = document.createElement("div");
  div.innerHTML = html;
  const el = div.firstElementChild;
  return { el };
};

describe("Outlet", () => {
  test("returns empty string for non-string html", () => {
    expect(Outlet(null)).toBe("");
    expect(Outlet(undefined)).toBe("");
    expect(Outlet(42)).toBe("");
    expect(Outlet({})).toBe("");
  });

  test("replaces unnamed default <slot> with children.default", () => {
    const html = "<div><slot>Fallback</slot></div>";
    const out = Outlet(html, {
      children: { default: "<strong>Hello</strong>" },
    });
    expect(out).toContain("<strong>Hello</strong>");
  });

  test("replaces unnamed default <slot> with slots.default", () => {
    const html = "<div><slot>Fallback</slot></div>";
    const out = Outlet(html, {
      slots: { default: "<em>From slot</em>" },
    });
    expect(out).toContain("<em>From slot</em>");
  });

  test("replaces unnamed default <slot> with children string", () => {
    const html = "<div><slot>Fallback</slot></div>";
    const out = Outlet(html, {
      children: "Plain string child",
    });
    expect(out).toContain("Plain string child");
  });

  test("falls back to slot fallback if no default content found", () => {
    const html = "<div><slot>Fallback content</slot></div>";
    const out = Outlet(html, {});
    expect(out).toContain("Fallback content");
  });

  test("replaces named <slot name=\"foo\"> with children[foo]", () => {
    const html = "<div><slot name=\"foo\">x</slot></div>";
    const out = Outlet(html, {
      children: { foo: "<b>Bar</b>" },
    });
    expect(out).toContain("<b>Bar</b>");
  });

  test("replaces named <slot name=\"bar\"> with slots[bar]", () => {
    const html = "<div><slot name=\"bar\">x</slot></div>";
    const out = Outlet(html, {
      slots: { bar: "<u>Bar slot</u>" },
    });
    expect(out).toContain("<u>Bar slot</u>");
  });

  test("calls function values before inserting", () => {
    const html = "<div><slot name=\"baz\">Default</slot></div>";
    const out = Outlet(html, {
      children: {
        baz: () => "<i>Dynamic</i>",
      },
    });
    expect(out).toContain("<i>Dynamic</i>");
  });

  test("inserts .el.outerHTML for component instance", () => {
    const html = "<div><slot name=\"comp\">Fallback</slot></div>";
    const comp = createComponentInstance("<h1>Comp</h1>");
    const out = Outlet(html, {
      children: { comp },
    });
    expect(out).toContain("<h1>Comp</h1>");
  });

  test("inserts real DOM Node content", () => {
    const html = "<div><slot name=\"node\">Fallback</slot></div>";
    const span = document.createElement("span");
    span.textContent = "Node content";
    const out = Outlet(html, {
      children: { node: span },
    });
    expect(out).toContain("Node content");
    expect(out).toContain("<span>");
  });

  test("supports <div data-slot=\"foo\"> replacement", () => {
    const html = `<div><div data-slot="foo">Fallback</div></div>`;
    const out = Outlet(html, {
      children: { foo: "<p>From ref slot</p>" },
    });
    expect(out).toContain("<p>From ref slot</p>");
  });

  test("supports data-slot replacement with fallback", () => {
    const html = `<div><div data-slot="x">Fallback X</div></div>`;
    const out = Outlet(html, {});
    expect(out).toContain("Fallback X");
  });

  test("prioritizes children over slots", () => {
    const html = "<div><slot name=\"dup\">Fallback</slot></div>";
    const out = Outlet(html, {
      children: { dup: "<a>From children</a>" },
      slots: { dup: "<i>From slot</i>" },
    });
    expect(out).toContain("<a>From children</a>");
    expect(out).not.toContain("From slot");
  });

  test("uses fallback when value is null or undefined", () => {
    const html = "<div><slot name=\"empty\">Fallback</slot></div>";
    const out = Outlet(html, {
      children: { empty: null },
    });
    expect(out).toContain("Fallback");
  });
});
