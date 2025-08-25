import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";
import { Counter } from "../Counter.browser.js";
import { escapeCode } from "../../docs/utils/escapeCode.js";

const codeExample = `import { Counter } from './Counter.browser.js';
Counter.mount('#counter-demo');`;

export const CounterExampleSection = createComponent(() => `
  <section class="counter-example-section">
    <h2>Counter Live Example</h2>
    <div id="counter-demo"></div>
    <h3>Code Example</h3>
    <pre class="line-numbers"><code class="language-js">${escapeCode(codeExample)}</code></pre>
    <p>Try clicking the buttons to increment, decrement, or reset the counter.</p>
  </section>
`, {
  onMount: () => {
    // Mount the live counter demo
    Counter.mount('#counter-demo');
  }
});
