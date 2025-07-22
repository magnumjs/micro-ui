/**
 * @jest-environment jsdom
 */

import { createComponent, renderList } from "../lib/reactive-core.js";
import { fireEvent, screen } from '@testing-library/dom';

describe("diffHTML branch coverage: moves existing DOM nodes", () => {
  let root;
  let Component;

  beforeEach(() => {
    root = document.createElement("div");
    document.body.appendChild(root);

    Component = createComponent(({ props }) => {
      // if (!props.items || props.items.length === 0) {
      //   return `<p>No items found.</p>`; // Or a loading spinner
      // }
      return `<ul data-testid="list"> ${renderList(
        props.items || [],
        (item) => `<div data-key="${item.id}">${item.label}</div>`,
        (item) => item.id
      )} </ul>`;
    });

    Component.mount(root);
  });

  afterEach(() => {
    Component.unmount();
    document.body.innerHTML = "";
  });

  test("moves existing DOM node when order changes (forces insertBefore)", () => {
    // Initial render: id order 1,2,3
    Component.update({
      items: [
        { id: 1, label: "One" },
        { id: 2, label: "Two" },
        { id: 3, label: "Three" },
      ],
    });

    
    // Immediately after update, DOM should have 3 children
    expect(screen.getByTestId("list").children.length).toBe(3);

    const oneBefore = root.querySelector('[data-key="1"]');
    const twoBefore = root.querySelector('[data-key="2"]');
    const threeBefore = root.querySelector('[data-key="3"]');

    // Reorder nodes
    Component.update({
      items: [
        { id: 2, label: "Two" },
        { id: 1, label: "One" },
        { id: 3, label: "Three" },
      ],
    });

    const oneAfter = root.querySelector('[data-key="1"]');
    const twoAfter = root.querySelector('[data-key="2"]');
    const threeAfter = root.querySelector('[data-key="3"]');

    // Nodes should be reused
    expect(oneAfter).toStrictEqual(oneBefore);
    expect(twoAfter).toStrictEqual(twoBefore);
    expect(threeAfter).toStrictEqual(threeBefore);

    // The new DOM order should be [2,1,3]
    const keys = Array.from(screen.getByTestId("list").children).map((el) => el.dataset.key);
    expect(keys).toEqual(["2", "1", "3"]);
  });
});
