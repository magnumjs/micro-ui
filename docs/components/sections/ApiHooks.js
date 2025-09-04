import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";

export const ApiHooksSection = createComponent(() => `
  <section class="api-hooks-section">
    <h2>Micro UI Compose Hooks</h2>
    <div id="api-hooks-step-1" style="display:block;">
      <h3>event(name, handler)</h3>
      <p><b>Purpose:</b> Subscribe to a named event channel within a component or context.</p>
      <ul>
        <li><b>Arguments:</b> <code>name</code> (string), <code>handler</code> (function)</li>
        <li><b>Returns:</b> Unsubscribe function</li>
        <li><b>Example:</b>
          <pre class="line-numbers"><code class="language-js">useEvent('user:login', (user) =&gt; {
  console.log('User logged in:', user);
});
</code></pre>
        </li>
      </ul>
      <button id="next-api-hooks" type="button" style="float:right;">Next &rarr;</button>
    </div>
    <div id="api-hooks-step-2" style="display:none;">
      <h3>useEffect(fn, deps)</h3>
      <p><b>Purpose:</b> Run a side effect when dependencies change (similar to React's useEffect).</p>
      <ul>
        <li><b>Arguments:</b> <code>fn</code> (function), <code>deps</code> (array)</li>
        <li><b>Returns:</b> Unsubscribe/cleanup function</li>
        <li><b>Example:</b>
          <pre class="line-numbers"><code class="language-js">useEffect(() =&gt; {
  console.log('Effect ran');
  return () =&gt; console.log('Cleanup');
}, [dep1, dep2]);
</code></pre>
        </li>
      </ul>
      <button id="prev-api-hooks" type="button" style="float:left;">&larr; Previous</button>
      <button id="next-api-hooks-2" type="button" style="float:right;">Next &rarr;</button>
    </div>
    <div id="api-hooks-step-3" style="display:none;">
      <h3>value(initial)</h3>
      <p><b>Purpose:</b> Create a reactive value container (like a signal or ref).</p>
      <ul>
        <li><b>Arguments:</b> <code>initial</code> (any)</li>
        <li><b>Returns:</b> Value API with <code>get</code>, <code>set</code>, <code>subscribe</code></li>
        <li><b>Example:</b>
          <pre class="line-numbers"><code class="language-js">
const count = useState(0);
count.subscribe(val =&gt; console.log(val));
count.set(1);
</code></pre>
        </li>
      </ul>
      <button id="prev-api-hooks-2" type="button" style="float:left;">&larr; Previous</button>
      <button id="next-api-hooks-3" type="button" style="float:right;">Next &rarr;</button>
    </div>
    <div id="api-hooks-step-4" style="display:none;">
      <h3>useFetch(url, options)</h3>
      <p><b>Purpose:</b> Fetch data reactively and subscribe to updates.</p>
      <ul>
        <li><b>Arguments:</b> <code>url</code> (string), <code>options</code> (object)</li>
        <li><b>Returns:</b> Value API with <code>get</code>, <code>set</code>, <code>subscribe</code></li>
        <li><b>Example:</b>
          <pre class="line-numbers"><code class="language-js">const data = useFetch('/api/todos');
data.subscribe(val =&gt; console.log(val));
</code></pre>
        </li>
      </ul>
      <button id="prev-api-hooks-3" type="button" style="float:left;">&larr; Previous</button>
    </div>
  </section>
`, {
  onMount: () => {
    const step1 = document.getElementById('api-hooks-step-1');
    const step2 = document.getElementById('api-hooks-step-2');
    const step3 = document.getElementById('api-hooks-step-3');
    const step4 = document.getElementById('api-hooks-step-4');
    const next1 = document.getElementById('next-api-hooks');
    const prev2 = document.getElementById('prev-api-hooks');
    const next2 = document.getElementById('next-api-hooks-2');
    const prev3 = document.getElementById('prev-api-hooks-2');
    const next3 = document.getElementById('next-api-hooks-3');
    const prev4 = document.getElementById('prev-api-hooks-3');
    function showStep(n) {
      step1.style.display = n === 1 ? 'block' : 'none';
      step2.style.display = n === 2 ? 'block' : 'none';
      step3.style.display = n === 3 ? 'block' : 'none';
      step4.style.display = n === 4 ? 'block' : 'none';
      window.location.hash = '#api-hooks-step-' + n;
    }
    if (next1) next1.onclick = () => showStep(2);
    if (prev2) prev2.onclick = () => showStep(1);
    if (next2) next2.onclick = () => showStep(3);
    if (prev3) prev3.onclick = () => showStep(2);
    if (next3) next3.onclick = () => showStep(4);
    if (prev4) prev4.onclick = () => showStep(3);
    // Handle direct hash navigation
    const hash = window.location.hash;
    if (hash.startsWith('#api-hooks-step-')) {
      const n = parseInt(hash.replace('#api-hooks-step-', ''));
      if (n >= 1 && n <= 4) showStep(n);
    }
  }
});
