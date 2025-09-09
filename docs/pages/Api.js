// API.js

import { escapeCode } from "../utils/escapeCode.js";
import { Alert } from "../comps/boot/Alert.js";


export const API = `
  <div class="container py-5">
    <h2 class="fw-bold mb-4">MicroUI API: <code>createComponent</code></h2>
    <p class="lead mb-3">The <code>createComponent</code> function is the heart of MicroUI. It lets you define interactive, reactive UI components with minimal code.</p>
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Core Properties</h5>
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><b>render</b>: <code>({ props, state, setState, refs }) =&gt; string</code> <br>Required. Returns the HTML for your component. Receives props, state, setState, and refs.</li>
          <li class="list-group-item"><b>state</b>: <code>object</code> <br>Initial state for your component. Use <code>setState</code> to update.</li>
          <li class="list-group-item"><b>props</b>: <code>object</code> <br>Properties passed from the parent or caller.</li>
          <li class="list-group-item"><b>on</b>: <code>object</code> <br>Event handlers. Keys are event selectors, values are handler functions.</li>
          <li class="list-group-item"><b>refs</b>: <code>object</code> <br>References to DOM nodes or child components (optional).</li>
        </ul>
      </div>
    </div>
    <h5 class="mt-4 mb-2">Common Usage Example</h5>
    <pre class="bg-dark text-light rounded p-3 text-start" style="font-size:0.95em;"><code>
import &#123; createComponent &#125; from '//unpkg.com/@magnumjs/micro-ui';

// Usage:

</code></pre>
    ${Alert({
      type: 'info',
      message: `<b>Tip:</b> <code>createComponent</code> supports advanced patterns like slots, keyed lists, and lifecycle hooks for more complex UIs.`,
      className: 'mt-4'
    })}
  </div>
`;
