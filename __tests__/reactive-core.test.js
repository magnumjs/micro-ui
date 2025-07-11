import { createState, createComponent } from '../lib/reactive-core.js';
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('createComponent', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('mounts and calls onMount lifecycle', () => {
    const onMount = jest.fn();
    const comp = createComponent(() => `<p>Hello</p>`, { onMount });
    comp.mount(container);
    expect(container.innerHTML).toContain('Hello');
    expect(onMount).toHaveBeenCalled();
  });

  it('calls onDestroy lifecycle and cleans DOM', () => {
    const onDestroy = jest.fn();
    const comp = createComponent(() => `<p>Bye</p>`, { onDestroy });
    comp.mount(container);
    comp.destroy();
    expect(container.innerHTML).toBe('');
    expect(onDestroy).toHaveBeenCalled();
  });

  it('renders and updates on props change', () => {
    const comp = createComponent(({ name }) => `<p>Hello, ${name}</p>`);
    comp.mount(container);
    comp.update({ name: 'Alice' });
    expect(container.innerHTML).toContain('Alice');
    comp.update({ name: 'Bob' });
    expect(container.innerHTML).toContain('Bob');
  });

  it('does not re-render if props do not change', () => {
    const renderFn = jest.fn(({ name }) => `<p>${name}</p>`);
    const comp = createComponent(renderFn);
    comp.mount(container);
    comp.update({ name: 'Alice' });
    comp.update({ name: 'Alice' }); // same props
    expect(renderFn).toHaveBeenCalledTimes(2); // mount + first update
  });

  it('supports event delegation with selector', () => {
    const onClick = jest.fn();
    const comp = createComponent(
      () => `
        <button id="btn">Click me</button>
      `,
      {
        events: {
          'click #btn': function (e) {
            onClick(e);
          },
        },
      }
    );
    comp.mount(container);
    container.querySelector('#btn').click();
    expect(onClick).toHaveBeenCalled();
  });

  it('binds events to component context and uses props', () => {
    const handler = jest.fn();
    const comp = createComponent(
      () => `<button id="btn">Go</button>`,
      {
        events: {
          'click #btn': function (e) {
            this.props.onGo();
          },
        },
      }
    );
    comp.mount(container);
    comp.update({ onGo: handler });
    container.querySelector('#btn').click();
    expect(handler).toHaveBeenCalled();
  });

  it('renders nested children passed as props', () => {
    const Child = createComponent(({ text }) => `<span>${text}</span>`);
    const Parent = createComponent(({ children }) => `<div>${children}</div>`);

    const childHTML = Child.render({ text: 'Child text' });
    Parent.mount(container);
    Parent.update({ children: childHTML });
    expect(container.innerHTML).toContain('Child text');
  });
});
