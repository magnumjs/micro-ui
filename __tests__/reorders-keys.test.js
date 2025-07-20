/**
 * @jest-environment jsdom
 */

import { createComponent, renderList } from '../lib/reactive-core.js';

describe('DOM diffing - reorders keyed elements', () => {
  let root;
  let Component;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);

    Component = createComponent(
      ({ items = [] }) => `
        <div>
          ${renderList(items, (item) => `<div>${item.label}</div>`, (item) => item.id)}
        </div>
      `
    );

    Component.mount(root);
  });

  afterEach(() => {
    Component.unmount();
    document.body.innerHTML = '';
  });

  test('moves existing DOM node when order changes (covers insertBefore)', () => {
    // Initial render with order: 1, 2
    Component.update({ items: [{ id: 1, label: 'One' }, { id: 2, label: 'Two' }] });

    // Store references to DOM nodes before reorder
    const oneBefore = root.querySelector('[data-key="1"]');
    const twoBefore = root.querySelector('[data-key="2"]');

    // Update with swapped order: 2, 1
    Component.update({ items: [{ id: 2, label: 'Two' }, { id: 1, label: 'One' }] });

    // Store references after reorder
    const oneAfter = root.querySelector('[data-key="1"]');
    const twoAfter = root.querySelector('[data-key="2"]');

    // Check that the same DOM nodes are reused (reference equality)
    expect(oneAfter).toStrictEqual(oneBefore);
    expect(twoAfter).toStrictEqual(twoBefore);

    // Check the order of nodes in the container (should be 2 then 1)
    const childrenKeys = Array.from(root.firstElementChild.children).map((el) => el.dataset.key);
    expect(childrenKeys).toEqual(['2', '1']);
  });
});
