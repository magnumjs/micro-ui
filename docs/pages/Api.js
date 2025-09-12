// API.js

import { escapeCode } from "../utils/escapeCode.js";
import { Alert, Accordion } from "../comps/boot/Bootstrap.js";


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
  <h5 class="mt-4 mb-2">Lifecycle Methods & Signatures <a href="#/api-instance" class="ms-2 small">See: Component Instance API</a></h5>
    ${Accordion({
      id: "api-lifecycle-accordion",
       items : [{
          title: "onMount",
          content: `<code>onMount(fn)</code><br>Called after the component is mounted in the DOM.<br><b>Signature:</b> <code>fn()</code><br><b>Context:</b> <code>this</code> (component instance API)`
        },
        {
          title: "onUnmount",
          content: `<code>onUnmount(fn)</code><br>Called before the component is removed from the DOM.<br><b>Signature:</b> <code>fn()</code><br><b>Context:</b> <code>this</code> (component instance API)`
        },
        {
          title: "onBeforeMount",
          content: `<code>onBeforeMount(fn)</code><br>Called before the component is mounted.<br><b>Signature:</b> <code>fn()</code><br><b>Context:</b> <code>this</code> (component instance API)`
        },
        {
          title: "onBeforeUnmount",
          content: `<code>onBeforeUnmount(fn)</code><br>Called before the component is unmounted.<br><b>Signature:</b> <code>fn()</code><br><b>Context:</b> <code>this</code> (component instance API)`
        },
        {
          title: "onUpdate",
          content: `<code>onUpdate(fn)</code><br>Called after the component updates.<br><b>Signature:</b> <code>fn(prevProps)</code><br><b>Context:</b> <code>this</code> (component instance API)<br><b>Arguments:</b> <code>prevProps</code> (object)`
        },
        {
          title: "onBeforeRender",
          content: `<code>onBeforeRender(fn)</code><br>Called before rendering HTML after <code>render</code> is called.<br><b>Signature:</b> <code>fn(html)</code><br><b>Context:</b> <code>this</code> (component instance API)<br><b>Arguments:</b> <code>html</code> (string)`
        }
      
      ]})}
    <h5 class="mt-4 mb-2">Common Usage Example</h5>
    <pre class="bg-dark text-light rounded p-3 text-start" style="font-size:0.95em;"><code>
${escapeCode(`import { createComponent } from '//unpkg.com/@magnumjs/micro-ui';

// Define a child component that takes a label and color
const Child = createComponent({
  render({ props }) {
    return \`<span style="color:\${props.color};font-weight:bold;">\${props.label}</span>\`;
  }
});

// Define a parent component that renders multiple children with unique params
const Parent = createComponent({
  render() {
    return \`
      <div>
        \${Child({ key: 'one', label: 'First', color: 'red' })}
        \${Child({ key: 'two', label: 'Second', color: 'green' })}
        \${Child({ key: 'three', label: 'Third', color: 'blue' })}
      </div>
    \`;
  }
});

// Mount the parent component
Parent.mount(document.getElementById('parent-demo'));
`)}</code></pre>
    ${Alert({
      type: 'info',
      message: `<b>Tip:</b> <code>createComponent</code> supports advanced patterns like slots, keyed lists, and lifecycle hooks for more complex UIs.`,
      className: 'mt-4'
    })}
  </div>
`;
