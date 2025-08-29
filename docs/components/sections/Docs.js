import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";

export const DocsSection = createComponent(() => `
  <section id="docs">
    <h2>📖 Micro UI Library Overview & Guidance</h2>
    <div id="docs-main-content">
      <p>
        <b>Micro UI</b> is inspired by modern reactive frameworks (like React, Svelte, and Solid.js) but aims for minimalism and direct use of native JavaScript and HTML.<br />
        <b>Influences:</b> Functional programming, composable UI, and declarative state management.<br />
        <b>Design Goals:</b> Simplicity, performance, and maintainability for small to medium projects.
      </p>
      <h3>How to Use</h3>
      <ul>
        <li>Use <code>createState</code> for reactive state containers.</li>
        <li>Build UI with <code>createComponent</code> using pure functions.</li>
        <li>Mount components to the DOM and update via state changes.</li>
        <li>Leverage lifecycle hooks for setup/teardown logic.</li>
        <li>Use slots and props for composition and reuse.</li>
      </ul>
      <h3>General Guidance</h3>
      <ul>
        <li>Keep components small and focused.</li>
        <li>Favor pure functions for rendering.</li>
        <li>Use state subscriptions for reactive updates.</li>
        <li>Organize logic, state, and view separately for clarity.</li>
        <li>Refer to the <a href="#api" data-section="api">API Reference</a> and <a href="#counter" data-section="counter">Counter</a> / <a href="#todo-list" data-section="todo-list">TodoList</a> examples for advanced patterns.</li>
      </ul>
      <h3>Further Reading</h3>
      <ul>
        <li><a href="https://github.com/magnumjs/micro-ui" target="_blank">GitHub Project</a></li>
        <li><a href="#getting-started" data-section="getting-started">Getting Started</a></li>
        <li><a href="#counter" data-section="counter">Counter Example</a></li>
        <li><a href="#todo-list" data-section="todo-list">TodoList Example</a></li>
        <li><a href="#advanced-usage" id="show-advanced-usage">Advanced Usage & Patterns</a></li>
      </ul>
    </div>
    <div id="docs-advanced-usage" style="display:none;">
      <button id="back-to-docs" style="margin-bottom:1em;">← Back to Docs</button>
      <section id="advanced-usage-step-1" style="display:block;">
        <h2>Advanced Usage & Patterns</h2>
        <h3>Step 1: Manual Component ID Usage</h3>
        <p>You can create a component, get its id via <code>.toString()</code>, and use it in your markup for dynamic mounting or referencing:</p>
        <pre class="line-numbers"><code class="language-js">// Create a component
const Comp = createComponent(() =&gt; '&lt;span&gt;Manual&lt;/span&gt;');
// Get its id before mount
const compId = Comp.toString();
// Use the id in markup
const html = '&lt;div data-comp="' + compId + '"&gt;&lt;/div&gt;';
document.body.innerHTML = html;
// Mount the component into the placeholder
document.querySelector('[data-comp="' + compId + '"]') &amp;&amp; Comp.mount('[data-comp="' + compId + '"]');
</code></pre>
        <button id="next-step-advanced" type="button" style="float:right;">Next &rarr;</button>
      </section>
      <section id="advanced-usage-step-2" style="display:none;">
        <h2>Advanced Usage & Patterns</h2>
        <h3>Step 2: Component Composition</h3>
        <p>Compose parent and child components using <code>data-comp</code> ids for flexible mounting and dynamic UI patterns:</p>
        <pre class="line-numbers"><code class="language-js">// Compose parent and child components
const Child = createComponent(() =&gt; '&lt;span&gt;Child&lt;/span&gt;');
const Parent = createComponent(() =&gt; '&lt;div data-comp="' + Child.toString() + '"&gt;&lt;/div&gt;');
Parent.mount('#parent');
// Mount child into placeholder
document.querySelector('[data-comp="' + Child.toString() + '"]') &amp;&amp; Child.mount('[data-comp="' + Child.toString() + '"]');
</code></pre>
        <button id="prev-step-advanced" type="button" style="float:left;">&larr; Previous</button>
      </section>
    </div>
  </section>
`, {
  onMount: () => {
    const showAdvanced = document.getElementById('show-advanced-usage');
    const docsMain = document.getElementById('docs-main-content');
    const docsAdvanced = document.getElementById('docs-advanced-usage');
    const backBtn = document.getElementById('back-to-docs');
    const step1 = document.getElementById('advanced-usage-step-1');
    const step2 = document.getElementById('advanced-usage-step-2');
    const nextBtn = document.getElementById('next-step-advanced');
    const prevBtn = document.getElementById('prev-step-advanced');
    function showStep(step) {
      if (step === 1) {
        step1.style.display = '';
        step2.style.display = 'none';
        window.location.hash = '#advanced-usage';
      } else if (step === 2) {
        step1.style.display = 'none';
        step2.style.display = '';
        window.location.hash = '#advanced-usage-step-2';
      }
    }
    if (showAdvanced && docsMain && docsAdvanced && backBtn && step1 && step2 && nextBtn && prevBtn) {
      showAdvanced.addEventListener('click', (e) => {
        e.preventDefault();
        docsMain.style.display = 'none';
        docsAdvanced.style.display = '';
        showStep(1);
      });
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        docsAdvanced.style.display = 'none';
        docsMain.style.display = '';
        window.location.hash = '#docs';
      });
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showStep(2);
      });
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showStep(1);
      });
      // Handle direct hash navigation
      if (window.location.hash === '#advanced-usage') {
        docsMain.style.display = 'none';
        docsAdvanced.style.display = '';
        showStep(1);
      } else if (window.location.hash === '#advanced-usage-step-2') {
        docsMain.style.display = 'none';
        docsAdvanced.style.display = '';
        showStep(2);
      }
    }
  },
  on: {
    "click *": (ctx) => {
      const section = ctx.event.target.dataset.section;
      if (section) {
        window.location.hash = `#${section}`;
      }
    }
  }
});
