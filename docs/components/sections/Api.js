import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";
import { escapeCode } from "../../docs/utils/escapeCode.js";

export const ApiSection = createComponent(() => `
  <section class="api-section">
    <h2>API Reference</h2>
    <p>The Micro UI API provides a minimal, composable set of functions for building reactive, component-based UIs with native JavaScript and HTML. Below are the core exports and their usage details.</p>
    <h3>createComponent(fn, options)</h3>
    <ul>
      <li><b>Purpose:</b> Defines a reactive UI component. Returns a callable instance with lifecycle, state, and DOM management.</li>
      <li><b>Arguments:</b>
        <ul>
          <li><code>fn</code>: Render function. Receives <code>{ state, setState, props, refs }</code> and returns an HTML string.</li>
          <li><code>options</code>: Optional object. Supports <code>state</code>, <code>on</code> (event handlers), <code>slots</code>, <code>onMount</code>, <code>onUnmount</code>, <code>onUpdate</code>, and more.</li>
        </ul>
      </li>
      <li><b>Returns:</b> Component instance with methods: <code>mount</code>, <code>update</code>, <code>setState</code>, <code>unmount</code>, <code>render</code>, <code>toString</code>, <code>el</code>, <code>props</code>, <code>state</code>, <code>onMount</code>, <code>onUnmount</code>, <code>onUpdate</code>, <code>refs</code>.</li>
      <li><b>Example:</b>
        <pre class="line-numbers"><code class="language-js">const MyComponent = createComponent(({ state, setState, props }) =&gt; '&lt;button onclick="..."&gt;Count: ' + state.count + '&lt;/button&gt;', { state: { count: 0 } });
MyComponent.mount('#app');
</code></pre>
      </li>
    </ul>
    <h3>createState(initial)</h3>
    <ul>
      <li><b>Purpose:</b> Creates a reactive state container. Returns an object with <code>get</code>, <code>set</code>, and <code>subscribe</code> methods.</li>
      <li><b>Arguments:</b> <code>initial</code>: Initial state object.</li>
      <li><b>Returns:</b> State API for reading, updating, and subscribing to changes.</li>
      <li><b>Example:</b>
        <pre class="line-numbers"><code class="language-js">const state = createState({ count: 0 });
state.subscribe(function(val) { console.log(val); });
state.set({ count: 1 });
</code></pre>
      </li>
    </ul>
    <h3>renderList(array, renderFn, keyFn)</h3>
    <ul>
      <li><b>Purpose:</b> Renders a list of items reactively, keyed for efficient updates.</li>
      <li><b>Arguments:</b>
        <ul>
          <li><code>array</code>: Array of items.</li>
          <li><code>renderFn</code>: Function to render each item.</li>
          <li><code>keyFn</code>: Function to return a unique key for each item.</li>
        </ul>
      </li>
      <li><b>Returns:</b> HTML string of rendered items.</li>
      <li><b>Example:</b>
        <pre class="line-numbers"><code class="language-js">const items = renderList([1,2,3], function(n) { return '&lt;li&gt;' + n + '&lt;/li&gt;'; }, function(n) { return n; });
</code></pre>
      </li>
    </ul>
    <h3>shared</h3>
    <ul>
      <li><b>Purpose:</b> Utility exports and helpers for advanced patterns.</li>
      <li><b>Includes:</b> <code>registerComponent</code>, <code>unregisterComponent</code>, <code>getComponentById</code>, <code>useCurrentComponent</code>, and more.</li>
      <li><b>Example:</b>
        <pre class="line-numbers"><code class="language-js">import { registerComponent, getComponentById } from 'micro-ui';
registerComponent(myComp);
const inst = getComponentById(myComp._id);
</code></pre>
      </li>
    </ul>
    <p>See below for more details and advanced usage patterns.</p>
  </section>
`);
