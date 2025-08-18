// Counter.core.js
export const counterConfig = {
  render: ({ state }) => `
    <div>
      <p data-testid="count-display">Count: ${state.count || 0}</p>
      <button data-testid="decrement-button">-</button>
      <button data-testid="increment-button">+</button>
      <button data-testid="reset-button">Reset</button>
    </div>
  `,
  options: {
    state: { count: 0 },
    on: {
      'click [data-testid="increment-button"]': ({ setState }) =>
        setState((s) => ({ count: s.count + 1 })),
      'click [data-testid="decrement-button"]': ({ setState }) =>
        setState((s) => ({ count: s.count - 1 })),
      'click [data-testid="reset-button"]': ({ setState }) =>
        setState({ count: 0 }),
    },
  },
};
