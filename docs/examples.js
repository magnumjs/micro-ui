// docs/examples.js
export function showCounterDemo(root) {
  root.innerHTML = `
    <section id="counter">
      <h2>🧮 Counter Example</h2>
      <div id="counter-demo"></div>
      <pre><code class="language-js">// Counter demo code here</code></pre>
    </section>
  `;
  // Optionally, mount your Counter component to #counter-demo
}

export function showTodoDemo(root) {
  root.innerHTML = `
    <section id="todo">
      <h2>✅ TodoList Example</h2>
      <div id="todo-demo"></div>
      <pre><code class="language-js">// Todo demo code here</code></pre>
    </section>
  `;
  // Optionally, mount your Todo component to #todo-demo
}

export function showTogglerDemo(root) {
  root.innerHTML = `
    <section id="toggler">
      <h2>🔀 Toggler Example</h2>
      <div id="toggler-demo"></div>
      <pre><code class="language-js">// Toggler demo code here</code></pre>
    </section>
  `;
  // Optionally, mount your TogglerWidget component to #toggler-demo
}
// Add more example functions as needed
