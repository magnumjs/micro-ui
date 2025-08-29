import { createComponent } from '../lib/reactive-core.js';

describe('componentFn call order cache (no key)', () => {
  it('preserves state by key when key prop is used', async () => {
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
        // Use key prop to preserve state by identity
        return state.items.map((idx) => Child({ idx, key: idx })).join('');
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

    // Remove first item, should preserve state by key
    Parent.setState({ items: [2, 3] });
    await Promise.resolve();
    const children2 = container.querySelectorAll('[data-ref="child"]');
    expect(children2.length).toBe(2);
    // State is preserved by key
    expect(children2[0].textContent).toBe('Child 2: 2');
    expect(children2[1].textContent).toBe('Child 3: 3');
  });
  it('syncs state with props using onUpdate', async () => {
    const Child = createComponent({
      state: { count: 0 },
      render({ props, state }) {
        return `<div data-ref="child">Child ${props.idx}: ${state.count}</div>`;
      },
      onMount() {
        this.setState({ count: this.props.idx });
      },
      onUpdate(prevProps) {
        if (this.props.idx !== prevProps.idx) {
          this.setState({ count: this.props.idx });
        }
      }
    });

    const Parent = createComponent({
      state: { items: [1, 2, 3] },
      render({ state }) {
        return state.items.map((idx) => Child({ idx })).join('');
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

    // Remove first item, should reuse instances by call order
    Parent.setState({ items: [2, 3] });
    await Promise.resolve();
    const children2 = container.querySelectorAll('[data-ref="child"]');
    expect(children2.length).toBe(2);
    // State is now synced to props
    expect(children2[0].textContent).toBe('Child 2: 2');
    expect(children2[1].textContent).toBe('Child 3: 3');
  });
  it('reuses child instance by call order, not by value (no key)', async () => {
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
        return state.items.map((idx) => Child({ idx })).join('');
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

    // Remove first item, should reuse instances by call order
    Parent.setState({ items: [2, 3] });
    await Promise.resolve();
    const children2 = container.querySelectorAll('[data-ref="child"]');
    expect(children2.length).toBe(2);

    // Positive: call order is reused, so instance at index 0 is reused for idx=2
    // Negative: state is NOT preserved by value, so count is not correct for idx=2
    expect(children2[0].textContent).not.toBe('Child 2: 2'); // Should fail if expecting value preservation
    expect(children2[0].textContent).toBe('Child 2: 1'); // Actually reuses old instance (was Child 1)
    expect(children2[1].textContent).toBe('Child 3: 3'); // Actually reuses old instance (was Child 2)
  });
});
