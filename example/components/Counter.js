// example/components/Counter.js
import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";

export const Counter = createComponent(
  ({ state }) => {
    return `
      <div>
          <p data-testid="count-display">Count: ${state.count || 0}</p>
          <button data-testid="decrement-button">-</button>
          <button data-testid="increment-button">+</button>
          <button data-testid="reset-button">Reset</button>
        </div>
    `;
  },
  {
    state: { count: 0 },
    on: {
      'click [data-testid="increment-button"]': ({ setState }) =>
        setState((s) => ({ count: s.count + 1 })),

      'click [data-testid="decrement-button"]': ({ setState }) =>
        setState((s) => ({ count: s.count - 1 })),

      'click [data-testid="reset-button"]': ({ setState }) =>
        setState({ count: 0 }),
    },
  }
);
