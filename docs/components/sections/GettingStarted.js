import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";
import { escapeCode } from "../../docs/utils/escapeCode.js";

export const GettingStarted = createComponent(() => `
  <section id="getting-started">
    <h2>🚀 Getting Started</h2>
    <p>
      <b>Micro UI</b> is a minimal JavaScript library for building
      reactive, functional UI components with native JS and HTML.<br />
      <span class="tag state">State</span>,
      <span class="tag logic">Logic</span>, and
      <span class="tag view">View</span> are separated for clarity and
      maintainability.
    </p>
    <h3>Install</h3>
    <pre><code class="language-bash">npm install @magnumjs/micro-ui</code></pre>
    <h3>Quick Example</h3>
    <pre class="line-numbers"><code class="language-js">
${escapeCode(`import { createComponent } from '@magnumjs/micro-ui
import { createState } from '@magnumjs/micro-ui/utils

const state = createState({ count: 0 });

const Counter = createComponent(({ count }) => \`
  <h1>Count: \${count}</h1>
  <button id="inc">+</button>
\`);

Counter.mount('#app');
state.subscribe(({ count }) => Counter.update({ count }));
document.getElementById('inc').onclick = () => state.setState({ count: state.state.count + 1 });
    `)}</code></pre>
    <h3>Features</h3>
    <ul>
      <li>Reactive state management with <code>createState</code></li>
      <li>Functional UI components with <code>createComponent</code></li>
      <li>Lifecycle hooks, event binding, slots, and more</li>
      <li>No dependencies, fast and tiny footprint</li>
    </ul>
    <h3>Learn More</h3>
    <ul>
      <li><a href="#docs" data-section="docs">Documentation</a></li>
      <li><a href="#api" data-section="api">API Reference</a></li>
      <li>
        <a href="https://github.com/magnumjs/micro-ui" target="_blank">GitHub Project</a>
      </li>
    </ul>
  </section>
`, {
  on: {
    "click *": (ctx) => {
      const section = ctx.event.target.dataset.section;
      if (section) {
        window.location.hash = `#${section}`;
      }
    }
  }
});
