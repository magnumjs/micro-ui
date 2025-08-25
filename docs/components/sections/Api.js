import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";

export const ApiSection = createComponent(() => `
  <section class="api-section">
    <h2>API Reference</h2>
    <ul>
      <li><strong>createComponent</strong>: Create a reactive UI component.</li>
      <li><strong>createState</strong>: Create reactive state for your app.</li>
      <li><strong>renderList</strong>: Render lists reactively.</li>
      <li><strong>shared</strong>: Shared utilities and helpers.</li>
    </ul>
    <p>See the documentation for usage examples and details.</p>
  </section>
`);
