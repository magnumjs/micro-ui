/**
 * @jest-environment jsdom
 */
import { createComponent } from "../lib/reactive-core.js";
import { jest } from "@jest/globals";

describe("_beforeRenderCbs hook", () => {
  it("calls all beforeRender callbacks and modifies html via options and this.onBeforeRender(cb)", () => {
    const beforeRenderA = jest.fn((html) => {
      console.log("Before Render A:", html);
      // Modify html string
      if (typeof html === "string" || html instanceof String) {
        html = html.replace(/Hello/, "Hi");
      }
      console.log("Before Render A Modified:", html);
      return html;
    });
    const beforeRenderB = jest.fn((html) => {
      // Append something
      if (typeof html === "string" || html instanceof String) {
        html = html + "<span>World</span>";
      }
      return html;
    });

    // Option-based hook
    const Comp = createComponent({
      render() {
        return `<div>Hello</div>`;
      },
      onBeforeRender: beforeRenderA,
    });

    // Register runtime hook before initial mount
    Comp.onBeforeRender(beforeRenderB);

    const container = document.createElement("div");
    Comp.mount(container);
    // Debug: print the registered beforeRender callbacks
    // eslint-disable-next-line no-console
    // Trigger a manual re-render to ensure both hooks are called
    // Comp.render();
    // The hooks should have modified the html
    expect(beforeRenderA).toHaveBeenCalled();
    expect(beforeRenderB).toHaveBeenCalled();
    // The html should be affected by both hooks
    expect(container.innerHTML).toContain("Hi");
    expect(container.innerHTML).toContain("World");
    // The returned html from render() should also be affected
    const rendered = Comp.render();
    expect(rendered.toString()).toContain("Hi");
    expect(rendered.toString()).toContain("World");
  });

  it("supports multiple runtime onBeforeRender hooks affecting html", () => {
    const cb1 = jest.fn((html) => {
      if (typeof html === "string" || html instanceof String) {
        html = html.replace(/foo/, "bar");
      }
      return html;
    });
    const cb2 = jest.fn((html) => {
      if (typeof html === "string" || html instanceof String) {
        html = html + "<b>baz</b>";
      }
      return html;
    });
    const Comp = createComponent({
      render() {
        this.onBeforeRender(cb1);
        this.onBeforeRender(cb2);
        return `<div>foo</div>`;
      },
    });
    const container = document.createElement("div");
    Comp.mount(container);
    expect(cb1).toHaveBeenCalled();
    expect(cb2).toHaveBeenCalled();
    expect(container.innerHTML).toContain("bar");
    expect(container.innerHTML).toContain("baz");
    const rendered = Comp.render();
    expect(rendered.toString()).toContain("bar");
    expect(rendered.toString()).toContain("baz");
  });
});
