/**
 * @jest-environment jsdom
 */

import { createComponent } from '../lib/reactive-core.js';

describe('this.refs support in createComponent', () => {
  let root;
  let Component;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    if (Component?.unmount) Component.unmount();
    document.body.innerHTML = '';
  });

  it('populates refs after mount', () => {
    Component = createComponent(() => `
      <div>
        <input data-ref="email" />
        <button data-ref="submit">Submit</button>
      </div>
    `);

    Component.mount(root);

    expect(Component.refs.email).toBeInstanceOf(HTMLInputElement);
    expect(Component.refs.submit).toBeInstanceOf(HTMLButtonElement);
  });

  it('updates refs after update', () => {
    Component = createComponent(({ props: {showExtra = false} }) => `
      <div>
        <input data-ref="email" />
        ${showExtra ? `<input data-ref="extra" />` : ``}
      </div>
    `);

    Component.mount(root);

    expect(Component.refs.email).toBeInstanceOf(HTMLInputElement);
    expect(Component.refs.extra).toBeNull();

    Component.update({ showExtra: true });

    expect(Component.refs.extra).toBeInstanceOf(HTMLInputElement);
  });

  it('clears stale refs on update', () => {
    Component = createComponent(({ props: {show} }) => `
      <div>
        ${show ? `<div data-ref="foo">Visible</div>` : ''}
      </div>
    `);

    Component.mount(root);
    Component.update({ show: true });
    expect(Component.refs.foo?.textContent).toBe('Visible');

    Component.update({ show: false });
    expect(Component.refs.foo).toBeNull();
  });

  it('works inside nested elements', () => {
    Component = createComponent(() => `
      <section>
        <div>
          <span data-ref="nested">Nested</span>
        </div>
      </section>
    `);

    Component.mount(root);
    expect(Component.refs.nested).toBeInstanceOf(HTMLSpanElement);
    expect(Component.refs.nested.textContent).toBe('Nested');
  });
});
