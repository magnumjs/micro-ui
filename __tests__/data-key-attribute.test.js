import { createComponent } from '../lib/reactive-core.js';

describe('data-key attribute propagation', () => {
  let parentEl, childEl;

  beforeEach(() => {
    document.body.innerHTML = '<div id="parent"></div><div id="child"></div>';
    parentEl = document.getElementById('parent');
    childEl = document.getElementById('child');
  });

  it('sets data-key on parent and child and maintains it across rerenders', () => {
    const Child = createComponent(({ props }) => {
      return `<span>Child</span>`;
    });

    const Parent = createComponent(({ props }) => {
      return `<div>Parent${Child({ key: props.childKey })}</div>`;
    });

    // Initial mount
    Parent.mount(parentEl, { key: 'parentKey', childKey: 'childKey' });
    Child.mount(childEl, { key: 'childKey' });

    expect(parentEl.getAttribute('data-key')).toBe('parentKey');
    expect(childEl.getAttribute('data-key')).toBe('childKey');

    // Rerender with new keys
    Parent.update({ key: 'parentKey2', childKey: 'childKey2' });
    Child.update({ key: 'childKey2' });

    expect(parentEl.getAttribute('data-key')).toBe('parentKey2');
    expect(childEl.getAttribute('data-key')).toBe('childKey2');

    // Rerender with same keys
    Parent.update({ key: 'parentKey2', childKey: 'childKey2' });
    Child.update({ key: 'childKey2' });

    expect(parentEl.getAttribute('data-key')).toBe('parentKey2');
    expect(childEl.getAttribute('data-key')).toBe('childKey2');
  });

  it('sets data-key for multiple child instances in a loop and maintains them across rerenders', () => {
    const Child = createComponent(({ props }) => {
      return `<span>Child ${props.key}</span>`;
    });

    const Parent = createComponent(({ props }) => {
      return `<div>Parent${props.childKeys.map((key, i) => Child({ key })).join('')}</div>`;
    });

    document.body.innerHTML = '<div id="parent"></div>';
    const parentEl = document.getElementById('parent');

    // Initial mount with keys
    const childKeys = ['c1', 'c2', 'c3'];
    Parent.mount(parentEl, { key: 'parentKey', childKeys });

    expect(parentEl.getAttribute('data-key')).toBe('parentKey');
    let renderedChildRootEls = parentEl.querySelectorAll('div[data-key]');
    childKeys.forEach((key, i) => {
      expect(renderedChildRootEls[i].getAttribute('data-key')).toBe(key);
    });

    // Rerender with new keys
    const newChildKeys = ['c4', 'c5', 'c6'];
    Parent.update({ key: 'parentKey2', childKeys: newChildKeys });

    expect(parentEl.getAttribute('data-key')).toBe('parentKey2');
    renderedChildRootEls = parentEl.querySelectorAll('div[data-key]');
    newChildKeys.forEach((key, i) => {
      expect(renderedChildRootEls[i].getAttribute('data-key')).toBe(key);
    });

    // Rerender with same keys
    Parent.update({ key: 'parentKey2', childKeys: newChildKeys });

    expect(parentEl.getAttribute('data-key')).toBe('parentKey2');
    renderedChildRootEls = parentEl.querySelectorAll('div[data-key]');
    newChildKeys.forEach((key, i) => {
      expect(renderedChildRootEls[i].getAttribute('data-key')).toBe(key);
    });
  });
});
