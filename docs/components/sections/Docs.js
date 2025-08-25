import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";

export const DocsSection = createComponent(() => `
  <section id="docs">
    <h2>📖 Micro UI Library Overview & Guidance</h2>
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
      <li>Refer to the <a href="#api" data-section="api">API Reference</a> and <a href="#counter" data-section="counter">Counter</a> / <a href="#todo" data-section="todo">TodoList</a> examples for advanced patterns.</li>
    </ul>
    <h3>Further Reading</h3>
    <ul>
      <li><a href="https://github.com/magnumjs/micro-ui" target="_blank">GitHub Project</a></li>
      <li><a href="#getting-started" data-section="getting-started">Getting Started</a></li>
      <li><a href="#counter" data-section="counter">Counter Example</a></li>
      <li><a href="#todo" data-section="todo">TodoList Example</a></li>
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
