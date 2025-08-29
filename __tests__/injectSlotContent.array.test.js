import injectSlotContent from '../lib/injectSlotContent.js';

describe('injectSlotContent array node logic', () => {
  it('handles string array items and sets node correctly', () => {
    const parent = document.createElement('div');
    const slot = document.createElement('span');
    parent.appendChild(slot);
    const api = { _mountedChildren: [] };
    const arr = ['<b>foo</b>', '<i>bar</i>'];
    injectSlotContent(slot, arr, api);
    // After injection, parent should have two children: <b>foo</b> and <i>bar</i>
    expect(parent.children.length).toBe(2);
    expect(parent.children[0].tagName).toBe('B');
    expect(parent.children[0].textContent).toBe('foo');
    expect(parent.children[1].tagName).toBe('I');
    expect(parent.children[1].textContent).toBe('bar');
  });
  it('reuses existing keyed node and calls update', () => {
    const parent = document.createElement('div');
    const slot = document.createElement('span');
    parent.appendChild(slot);
    const api = { _mountedChildren: [] };

    // Create a mock component instance with key and update
    const el = document.createElement('div');
    el.setAttribute('data-key', 'abc');
    parent.appendChild(el);
    let updated = false;
    const comp = {
      props: { key: 'abc' },
      el,
      update: () => { updated = true; },
      isMounted: () => true
    };

    // Call injectSlotContent with array containing the same key
    injectSlotContent(slot, [comp], api);

    // Should reuse the node and call update
    expect(parent.children.length).toBe(1);
    expect(parent.children[0]).toBe(el);
    expect(updated).toBe(true);
  });
});
