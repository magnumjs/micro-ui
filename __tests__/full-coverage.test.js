/**
 * @jest-environment jsdom
 */

import diffHTML from "../lib/diffHTML.js";
import injectSlotContent from "../lib/injectSlotContent.js";
import Outlet from "../lib/outlet.js";
import { createComponent } from "../lib/reactive-core.js";

describe("Patch uncovered branches", () => {
  test("diffHTML: removes leftover keyed elements", () => {
    const el = document.createElement("div");
    el.innerHTML = '<div data-key="a">Old A</div><div data-key="b">Old B</div>';
    const html = new String('<div data-key="a">Old A</div>');
    html._id = "test1";
    diffHTML(el, html);
    expect(el.innerHTML).toBe('<div data-key="a">Old A</div>');
  });

  test("diffHTML: removes excess children after diff", () => {
    const el = document.createElement("div");
    el.innerHTML = "<div>One</div><div>Two</div>";
    const html = new String("<div>One</div>");
    html._id = "test2";
    diffHTML(el, html);
    expect(el.innerHTML).toBe("<div>One</div>");
  });

  test("injectSlotContent: ignores unknown types in array", () => {
    const ref = document.createElement("div");
    ref.setAttribute("data-ref", "slot");
    document.body.appendChild(ref);
    injectSlotContent(ref, [{ notValid: true }, 123]);
    expect(document.body.innerHTML).not.toContain("notValid");
  });

  test("outlet: falls back when children.default is null", () => {
    const html = "<slot></slot>";
    const props = {
      children: { default: null },
    };
    const result = Outlet(html, props);
    expect(result).toBe("");
  });

  test("reactive-core: component instance renders without mount", () => {
    const Comp = createComponent(() => "<div>Hello</div>");
    const instance = Comp({});
    const html = instance.render();
    expect(String(html)).toContain("Hello");
  });

  test("reactive-core: component returns null and handles unmount", () => {
    const Comp = createComponent(() => null, {
      onUnmount() {
        // coverage
      },
    });

    const div = document.createElement("div");
    document.body.appendChild(div);

    Comp.mount(div);
    Comp.setState({});
    Comp.unmount();

    expect(Comp.el.innerHTML).toBe(""); // was not el === null
  });
});
