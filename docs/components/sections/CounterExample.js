import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";
import { Counter } from "../Counter.browser.js";
import { escapeCode } from "../../docs/utils/escapeCode.js";

const codeExample = `import { Counter } from './Counter.browser.js';
Counter.mount('#counter-demo');`;

const codeExample2 = `
// Counter.browser.js
import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";
import { counterConfig } from "./Counter.core.js";

export const Counter = createComponent(counterConfig.render, counterConfig.options);

// Counter.core.js
export const counterConfig = {
  render: ({ state }) => \`
    <div>
      <p data-testid="count-display">Count: \${state.count || 0}</p>
      <button data-testid="decrement-button">-</button>
      <button data-testid="increment-button">+</button>
      <button data-testid="reset-button">Reset</button>
    </div>
  \`,
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
}`;

export const CounterExampleSection = createComponent(() => `
  <section class="counter-example-section">
    <h2>Counter Live Example</h2>
    <div id="counter-demo"></div>
    <h3>Code Example</h3>
    <pre class="line-numbers"><code class="language-js">${escapeCode(codeExample)}</code></pre>
    <p>Try clicking the buttons to increment, decrement, or reset the counter.</p>
    <h3>Counter Component Implementation</h3>
    <pre><code class="language-js">${escapeCode(codeExample2)}</code></pre>
  </section>
`, {
  onMount: () => {
    // Mount the live counter demo
    Counter.mount('#counter-demo');
  }
});
