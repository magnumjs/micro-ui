/**
 * @jest-environment jsdom
 */

import { renderList } from "../lib/reactive-core.js";

describe("renderList", () => {
  it("renders keyed list correctly", () => {
    const data = [
      { id: "a", text: "First" },
      { id: "b", text: "Second" },
    ];

    const html = renderList(data, (item) => `<span>${item.text}</span>`);
    const container = document.createElement("div");
    container.innerHTML = html;

    const children = Array.from(container.children);

    expect(children).toHaveLength(2);
    expect(children[0].dataset.key).toBe("a");
    expect(children[0].innerHTML).toContain("First");
    expect(children[1].dataset.key).toBe("b");
    expect(children[1].innerHTML).toContain("Second");
  });

  it("applies key function correctly", () => {
    const data = [
      { name: "x", text: "Item X" },
      { name: "y", text: "Item Y" },
    ];

    const html = renderList(data, (item) => `<span>${item.text}</span>`, (i) => i.name);
    const container = document.createElement("div");
    container.innerHTML = html;

    expect(container.children[0].dataset.key).toBe("x");
    expect(container.children[1].dataset.key).toBe("y");
  });
});
