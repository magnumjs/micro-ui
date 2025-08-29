import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";
import { escapeCode } from "../../docs/utils/escapeCode.js";

const manualIdExample = `// Create a component
const Comp = createComponent(() => `<span>Manual</span>`);
// Get its id before mount
const compId = Comp.toString();
// Use the id in markup
const html = `<div data-comp="${compId}"></div>`;
document.body.innerHTML = html;
// Mount the component into the placeholder
document.querySelector(`[data-comp='${compId}']`) && Comp.mount(`[data-comp='${compId}']`);`;

const compositionExample = `// Compose parent and child components
const Child = createComponent(() => `<span>Child</span>`);
const Parent = createComponent(() => `<div data-comp='${Child.toString()}'></div>`);
Parent.mount('#parent');
// Mount child into placeholder
document.querySelector(`[data-comp='${Child.toString()}']`) && Child.mount(`[data-comp='${Child.toString()}']`);`;

export const AdvancedUsageSection = createComponent(() => `
  <section class="advanced-usage-section">
    <h2>Advanced Usage & Patterns</h2>
    <h3>Manual Component ID Usage</h3>
    <p>You can create a component, get its id via <code>.toString()</code>, and use it in your markup for dynamic mounting or referencing:</p>
    <pre class="line-numbers"><code class="language-js">${escapeCode(manualIdExample)}</code></pre>
    <h3>Component Composition</h3>
    <p>Compose parent and child components using <code>data-comp</code> ids for flexible mounting and dynamic UI patterns:</p>
    <pre class="line-numbers"><code class="language-js">${escapeCode(compositionExample)}</code></pre>
    <ul>
      <li>Use <code>Comp.toString()</code> to get the id before mount.</li>
      <li>Mount components into placeholders using <code>data-comp</code> attributes.</li>
      <li>Enable advanced patterns like dynamic slot injection, manual hydration, and interoperability with vanilla JS.</li>
    </ul>
  </section>
`);
