// example/components/Counter.js
import { createComponent } from '../../lib/reactive-core.js';

let internalCount = 0;

export const Counter = createComponent(
  ({ count = internalCount }) => `
    <div>
      <p>Count: ${count}</p>
      <button id="decrement">-</button>
      <button id="increment">+</button>
      <button id="reset">Reset</button>
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
        this.reset()
      },
    },
  }
);

// Add a reset function for tests to reset internal state
Counter.reset = () => {
  internalCount = 0;
  Counter.update({ count: internalCount });
};
