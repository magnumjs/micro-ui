import { Counter } from '../../components/Counter.js';
import { escapeCode } from '../utils/escapeCode.js';


export function renderCounterDocs() {
  const section = document.createElement('section');
  section.id = 'counter';

  section.innerHTML = `
    <h2>🧮 Counter Component</h2>

    <div class="demo-box" id="counter-demo"></div>

    <div class="step">
      <h4>1. Define the Component</h4>
       <pre class="line-numbers"><code class="language-js">${escapeCode(Counter.renderFn.toString())}</code></pre>
    </div>

    <div class="step">
      <h4>2. Mount to DOM</h4>
       <pre class="line-numbers"><code class="language-js">Counter.mountTo('#counter-demo');</code></pre>
    </div>

    <div class="step">
      <h4>3. Update Reactively</h4>
       <pre class="line-numbers"><code class="language-js">Counter.update({ count: 5 });</code></pre>
    </div>
  `;

  document.getElementById('docs-root').appendChild(section);
  Counter.mount('#counter-demo');
  Counter.update({ count: 0 });
}
