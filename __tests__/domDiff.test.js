/**
 * @jest-environment jsdom
 */

import { createComponent, renderList } from '../lib/reactive-core.js';

describe('renderList and DOM diffing', () => {
  let root;
  let Component;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);

    Component = createComponent(
      ({ props: {items = []} }) => `
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

  it('renders list with keyed children', () => {
    Component.update({ items: [{ id: 1, label: 'One' }, { id: 2, label: 'Two' }] });
    expect(root.innerHTML).toContain('One');
    expect(root.innerHTML).toContain('Two');
  });

  it('preserves DOM nodes with matching keys', () => {
    Component.update({ items: [{ id: 1, label: 'One' }, { id: 2, label: 'Two' }] });
    const firstNode = root.querySelector('[data-key="1"]');

    Component.update({ items: [{ id: 2, label: 'Two' }, { id: 1, label: 'One' }] }); // swap order

    const movedNode = root.querySelector('[data-key="1"]');
    expect(movedNode.outerHTML).toBe(firstNode.outerHTML); // ✅ compares markup
  });

  it('removes stale nodes', () => {
    Component.update({ items: [{ id: 1, label: 'One' }, { id: 2, label: 'Two' }] });
    Component.update({ items: [{ id: 2, label: 'Two' }] }); // drop one
    expect(root.innerHTML).not.toContain('One');
  });
  it('if currentNode !== existing', () => {
    Component.update({ items: [{ id: 1, label: 'One' }, { id: 2, label: 'Two' }] });
    const firstNode = root.querySelector('[data-key="1"]');

    // Update the first item
    Component.update({ items: [{ id: 1, label: 'Updated One' }, { id: 2, label: 'Two' }] });

    const updatedNode = root.querySelector('[data-key="1"]');
    expect(updatedNode).not.toBe(firstNode); // ✅ should be a different node
    expect(updatedNode.innerHTML).toContain('Updated One');
  });
});
