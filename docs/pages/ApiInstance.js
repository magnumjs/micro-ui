// ApiInstance.js
// Docs section for MicroUI component instance API
import { Alert } from "../comps/boot/Bootstrap.js";

export const ApiInstance = `
  <div class="container py-5" id="component-instance-api">
    <h2 class="fw-bold mb-4">Component Instance API</h2>
    <p class="lead mb-3">The <code>api</code> object is passed to lifecycle hooks and available from <code>createComponent</code> instances. It provides methods and properties for interacting with your component.</p>
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">API Properties & Methods</h5>
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><b>props</b>: <code>object</code> – Current props</li>
          <li class="list-group-item"><b>state</b>: <code>object</code> – Current state</li>
          <li class="list-group-item"><b>setState</b>: <code>(nextState)</code> – Update state</li>
          <li class="list-group-item"><b>refs</b>: <code>object</code> – DOM or child refs</li>
          <li class="list-group-item"><b>on</b>: <code>object</code> – Event handlers</li>
          <li class="list-group-item"><b>isMounted</b>: <code>() =&gt; boolean</code> – Is component mounted?</li>
          <li class="list-group-item"><b>onMount</b>: <code>(fn)</code> – Register mount hook</li>
          <li class="list-group-item"><b>onUnmount</b>: <code>(fn)</code> – Register unmount hook</li>
          <li class="list-group-item"><b>onBeforeMount</b>: <code>(fn)</code> – Register before mount hook</li>
          <li class="list-group-item"><b>onBeforeUnmount</b>: <code>(fn)</code> – Register before unmount hook</li>
          <li class="list-group-item"><b>onUpdate</b>: <code>(fn)</code> – Register update hook</li>
          <li class="list-group-item"><b>onBeforeRender</b>: <code>(fn)</code> – Register before render hook</li>
          <li class="list-group-item"><b>mount</b>: <code>(target, props)</code> – Mount to DOM</li>
          <li class="list-group-item"><b>update</b>: <code>(props)</code> – Update props</li>
          <li class="list-group-item"><b>unmount</b>: <code>()</code> – Unmount from DOM</li>
        </ul>
      </div>
    </div>
    ${Alert({
      type: 'info',
      message: `<b>Note:</b> The <code>api</code> object is passed to all lifecycle hooks and is available from any component instance.`,
      className: 'mt-4'
    })}
  </div>
`;
