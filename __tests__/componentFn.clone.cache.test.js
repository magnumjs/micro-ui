import { createComponent } from "../lib/reactive-core.js";

describe("componentFn clone and call order cache", () => {
  it("creates unique child instances per parent render call order and resets cache on new render", async () => {
    const Child = createComponent({
      state: { count: 0 },
      render({ props, state }) {
        return `<div data-ref="child">Child ${props.idx}: ${state.count}</div>`;
      },
      onMount() {
        this.setState({ count: this.props.idx });
      },
    });

    const Parent = createComponent({
      state: { items: [1, 2, 3] },
      render({ state }) {
        // Use key prop to ensure new instances for new items
        return state.items.map((idx) => Child({ idx })).join("");
      },
    });

    const container = document.createElement("div");
    document.body.appendChild(container);
    Parent.mount(container);
    await Promise.resolve();
    const children = container.querySelectorAll('[data-ref="child"]');
    expect(children.length).toBe(3);
    expect(children[0].textContent).toBe("Child 1: 1");
    expect(children[1].textContent).toBe("Child 2: 2");
    expect(children[2].textContent).toBe("Child 3: 3");

    // Trigger parent re-render with new items
    Parent.setState({ items: [4, 5] });
    await Promise.resolve();

    const children2 = container.querySelectorAll('[data-ref="child"]');
    expect(children2.length).toBe(2);
    expect(children2[0].textContent).toBe("Child 4: 1");
    expect(children2[1].textContent).toBe("Child 5: 3");
  });

  it("creates unique child instances per parent render call order and resets cache on new render", async () => {
    const Child = createComponent({
      state: { count: 0 },
      render({ props, state }) {
        return `<div data-ref="child">Child ${props.idx}: ${state.count}</div>`;
      },
      onMount() {
        this.setState({ count: this.props.idx });
      },
    });

    const Parent = createComponent({
      state: { items: [1, 2, 3] },
      render({ state }) {
        // Use key prop to ensure new instances for new items
        return state.items.map((idx) => Child({ idx, key: idx })).join("");
      },
    });

    const container = document.createElement("div");
    document.body.appendChild(container);
    Parent.mount(container);
    await Promise.resolve();
    const children = container.querySelectorAll('[data-ref="child"]');
    expect(children.length).toBe(3);
    expect(children[0].textContent).toBe("Child 1: 1");
    expect(children[1].textContent).toBe("Child 2: 2");
    expect(children[2].textContent).toBe("Child 3: 3");

    // Trigger parent re-render with new items
    Parent.setState({ items: [4, 5] });
    await Promise.resolve();

    const children2 = container.querySelectorAll('[data-ref="child"]');
    expect(children2.length).toBe(2);
    expect(children2[0].textContent).toBe("Child 4: 0");
    expect(children2[1].textContent).toBe("Child 5: 0");
  });
});
it("updates state via onUpdate with safety guard (no keys)", async () => {
  const Child = createComponent({
    state: { count: 0 },
    render({ props, state }) {
      return `<div data-ref="child">Child ${props.idx}: ${state.count}</div>`;
    },
    onUpdate(prevProps) {
      // Only update if count is different and not already set
      if (this.state.count !== this.props.idx) {
        this.setState({ count: this.props.idx });
      }
    },
  });

  const Parent = createComponent({
    state: { items: [1, 2, 3] },
    render({ state }) {
      return state.items.map((idx) => Child({ idx })).join("");
    },
  });

  const container = document.createElement("div");
  document.body.appendChild(container);
  Parent.mount(container);
  await Promise.resolve();
  const children = container.querySelectorAll('[data-ref="child"]');
  expect(children.length).toBe(3);
  expect(children[0].textContent).toBe("Child 1: 0");
  expect(children[1].textContent).toBe("Child 2: 0");
  expect(children[2].textContent).toBe("Child 3: 0");

  Parent.setState({ items: [4, 5] });
  await Promise.resolve();
  const children2 = container.querySelectorAll('[data-ref="child"]');
  expect(children2.length).toBe(2);
  expect(children2[0].textContent).toBe("Child 4: 4");
  expect(children2[1].textContent).toBe("Child 5: 5");
});

it("updates state via onUpdate with safety guard (with keys)", async () => {
  const Child = createComponent({
    state: { count: 0 },
    render({ props, state }) {
      return `<div data-ref="child">Child ${props.idx}: ${state.count}</div>`;
    },
    onUpdate(prevProps) {
      // Only update if count is different and not already set
      if (this.state.count !== this.props.idx) {
        this.setState({ count: this.props.idx });
      }
    },
  });

  const Parent = createComponent({
    state: { items: [1, 2, 3] },
    render({ state }) {
      return state.items.map((idx) => Child({ idx, key: idx })).join("");
    },
  });

  const container = document.createElement("div");
  document.body.appendChild(container);
  Parent.mount(container);
  await Promise.resolve();
  const children = container.querySelectorAll('[data-ref="child"]');
  expect(children.length).toBe(3);
  expect(children[0].textContent).toBe("Child 1: 0");
  expect(children[1].textContent).toBe("Child 2: 0");
  expect(children[2].textContent).toBe("Child 3: 0");

  Parent.setState({ items: [4, 5] });
  await Promise.resolve();
  const children2 = container.querySelectorAll('[data-ref="child"]');
  expect(children2.length).toBe(2);
  expect(children2[0].textContent).toBe("Child 4: 0");
  expect(children2[1].textContent).toBe("Child 5: 0");
});
