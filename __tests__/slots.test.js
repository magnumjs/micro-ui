/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core.js";

describe("Named Slots and Default Children", () => {
  let root;

  beforeEach(() => {
    root = document.createElement("div");
    document.body.appendChild(root);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders named and default slots correctly", () => {
    const Test = createComponent(() => `
      <div>
        <div><slot></slot></div>
        <footer><slot name="footer"></slot></footer>
      </div>
    `);

    Test.mount(root);
    Test.update({
      children: "<p>Main content</p>",
      slots: { footer: "<small>Footer content</small>" },
    });

    expect(root.innerHTML).toContain("Main content");
    expect(root.innerHTML).toContain("Footer content");
  });

  it("falls back to children if no slots.default", () => {
    const Test = createComponent(() => `
      <div><slot></slot></div>
    `);

    Test.mount(root);
    Test.update({ children: "<p>Fallback content</p>" });

    expect(root.innerHTML).toContain("Fallback content");
  });
});
