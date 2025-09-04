/**
 * @jest-environment jsdom
 */

import { createComponent } from "../lib/reactive-core.js";
import { renderList } from "../lib/utils/";
import { fireEvent, screen } from '@testing-library/dom';

describe("DOM diffing - reorders keyed elements", () => {
  let root;
  let Component;

  beforeEach(() => {
    root = document.createElement("div");
    document.body.appendChild(root);

    // Component returns just the list items — no wrapping div
    Component = createComponent(({ props }) => {
      return `<ul data-testid="list"> ${renderList(
        props.items || [],
        (item) => `<div>${item.label}</div>`,
        (item) => item.id
      )} </ul>`;
    });

    Component.mount(root);
  });

  afterEach(() => {
    Component.unmount();
    document.body.innerHTML = "";
  });

  test("moves existing DOM node when order changes (covers insertBefore)", () => {
    // Initial render with two items
    Component.update({
      items: [
        { id: 1, label: "One" },
        { id: 2, label: "Two" },
      ],
    });

    // Check initial keyed nodes exist
    const oneBefore = root.querySelector('[data-key="1"]');
    const twoBefore = root.querySelector('[data-key="2"]');
    expect(oneBefore).not.toBeNull();
    expect(twoBefore).not.toBeNull();

    // Update with reversed order
    Component.update({
      items: [
        { id: 2, label: "Two" },
        { id: 1, label: "One" },
      ],
    });

    const oneAfter = root.querySelector('[data-key="1"]');
    const twoAfter = root.querySelector('[data-key="2"]');

    // Same DOM nodes reused
    expect(oneAfter).toStrictEqual(oneBefore);
    expect(twoAfter).toStrictEqual(twoBefore);

    // The order of the children should now be ["2", "1"]
    const childrenKeys = Array.from(screen.getByTestId("list").children).map((el) => el.dataset.key);
    expect(childrenKeys).toEqual(["2", "1"]);
  });
});
