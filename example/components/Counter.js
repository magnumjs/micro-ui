// example/components/Counter.js
import { createComponent } from '../../lib/reactive-core.js';

let internalCount = 0;

export const Counter = createComponent(
  ({ count = internalCount }) => `
    <div data-testid="counter-root">
      <p data-testid="count-display">Count: ${count}</p>
      <button id="decrement" data-testid="decrement-button">-</button>
      <button id="increment" data-testid="increment-button">+</button>
      <button id="reset" data-testid="reset-button">Reset</button>
    </div>
  `,
  {
    events: {
      'click #increment': function () {
        internalCount++;
        this.update({ count: internalCount });
      },
      'click #decrement': function () {
        internalCount--;
        this.update({ count: internalCount });
      },
      'click #reset': function () {
        this.reset();
      },
    },
  }
);

// Add a reset function for tests to reset internal state
Counter.reset = () => {
  internalCount = 0;
  Counter.update({ count: internalCount });
};
