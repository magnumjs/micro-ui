import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";
import { escapeCode } from "../../docs/utils/escapeCode.js";

const codeExample = `const MyComponent = createComponent(() => \`Hello!\`);
MyComponent.mount('#app');`;

export const CreateComponentSection = createComponent(() => `
  <section class="create-component-section">
    <h2>createComponent API</h2>
    <p><strong>createComponent(fn, options):</strong> Create a reactive UI component.</p>
    <pre class="line-numbers"><code class="language-js">${escapeCode(codeExample)}</code></pre>
    <ul>
      <li><strong>fn</strong>: Render function returning HTML string.</li>
      <li><strong>options</strong>: Optional lifecycle and event handlers.</li>
    </ul>
    <p>Use <code>mount</code> to attach your component to the DOM.</p>
  </section>
`);
