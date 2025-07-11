import { Counter } from '../components/Counter.js';

function renderCounterDocs() {
  const section = document.createElement('section');
  section.id = 'counter';

  section.innerHTML = `
    <h2>🧮 Counter Component</h2>

    <div class="demo-box" id="counter-demo"></div>

    <div class="step">
      <h4>1. Define the Component</h4>
      <pre><code>${escapeCode(Counter.render.toString())}</code></pre>
    </div>

    <div class="step">
      <h4>2. Mount to DOM</h4>
      <pre><code>Counter.mountTo('#counter-demo');</code></pre>
    </div>

    <div class="step">
      <h4>3. Update Reactively</h4>
      <pre><code>Counter.update({ count: 5 });</code></pre>
    </div>
  `;

  document.getElementById('docs-root').appendChild(section);
  Counter.mountTo('#counter-demo');
  Counter.update({ count: 0 });
}

function escapeCode(str) {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Kick off rendering
renderCounterDocs();
