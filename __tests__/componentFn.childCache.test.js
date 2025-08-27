import { createComponent } from '../lib/reactive-core.js';

xdescribe('componentFn _childCache and _renderIndex', () => {
  it('creates and caches unique stateful child instances per renderIndex when mounted', async () => {
    const Child = createComponent({
      state: { count: 0 },
      render({ props, state }) {
        return `<div data-ref="child">Child ${props.idx}: ${state.count}</div>`;
      },
      onMount() {
        this.setState({ count: this.props.idx });
      }
    });

    const Parent = createComponent({
      state: { items: [1, 2, 3] },
      render({ state }) {
        return state.items.map((idx, i) => Child({ idx, _renderIndex: i })).join('');
      }
    });

    const container = document.createElement('div');
    document.body.appendChild(container);
    Parent.mount(container);
    await Promise.resolve();

    const children = container.querySelectorAll('[data-ref="child"]');
    expect(children.length).toBe(3);
    expect(children[0].textContent).toBe('Child 1: 1');
    expect(children[1].textContent).toBe('Child 2: 2');
    expect(children[2].textContent).toBe('Child 3: 3');
  });
});
