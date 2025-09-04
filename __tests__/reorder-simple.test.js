/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core.js";
import { renderList } from "../lib/utils/";

/**
 * @jest-environment jsdom
 */

describe("Minimal DOM keyed reorder test", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  test("manually reorder keyed divs", () => {
    // Setup initial DOM:
    container.innerHTML = `
      <div data-key="1">One</div>
      <div data-key="2">Two</div>
    `;

    // Capture references
    const firstBefore = container.querySelector('[data-key="1"]');
    const secondBefore = container.querySelector('[data-key="2"]');

    // Manually reorder nodes: move key=2 before key=1
    const node2 = container.querySelector('[data-key="2"]');
    const node1 = container.querySelector('[data-key="1"]');

    container.insertBefore(node2, node1);

    // Capture references after reorder
    const firstAfter = container.querySelector('[data-key="1"]');
    const secondAfter = container.querySelector('[data-key="2"]');

    // Check references are the same (no new nodes created)
    expect(firstAfter).toBe(firstBefore);
    expect(secondAfter).toBe(secondBefore);

    // Check order in DOM is ["2", "1"]
    const keys = Array.from(container.children).map((el) => el.dataset.key);
    expect(keys).toEqual(["2", "1"]);
  });
});
