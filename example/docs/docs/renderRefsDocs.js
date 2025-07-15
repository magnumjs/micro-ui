import { createComponent } from "../../lib/reactive-core.js";
import { escapeCode } from "../utils/escapeCode.js";

export function renderRefsDocs() {
  const section = document.createElement("section");
  section.id = "refs-demo-section";

  section.innerHTML = `
    <h2>🔍 <code>this.refs</code> Support</h2>

    <div class="demo-box" id="refs-demo"></div>

    <div class="step">
      <h4>1. Define a Component Using <code>data-ref</code></h4>
      <pre class="line-numbers"><code class="language-js">${escapeCode(`
const RefsExample = createComponent(() => \`
  <div>
    <input type="text" data-ref="username" placeholder="Enter name..." />
    <button data-ref="submitBtn">Submit</button>
  </div>
\`, {
  onMount() {
    console.log('Mounted with refs:', this.refs);
    this.refs.submitBtn.addEventListener('click', () => {
      alert(\`Hello, \${this.refs.username.value}!\`);
    });
  }
});
      `)}</code></pre>
    </div>

    <div class="step">
      <h4>2. Mount to the DOM</h4>
      <pre class="line-numbers"><code class="language-js">RefsExample.mountTo('#refs-demo');</code></pre>
    </div>

    <div class="step">
      <h4>3. Access Refs in Lifecycle</h4>
      <pre class="line-numbers"><code class="language-js">
this.refs.username // ➜ &lt;input /&gt;
this.refs.submitBtn // ➜ &lt;button /&gt;
      </code></pre>
    </div>
  `;

  document.getElementById("docs-root").appendChild(section);

  // ✅ Live Demo
  const RefsExample = createComponent(() => `
    <div>
      <input type="text" data-ref="username" placeholder="Enter name..." />
      <button data-ref="submitBtn">Submit</button>
    </div>
  `, {
    onMount() {
      console.log("Mounted with refs:", this.refs);
      this.refs.submitBtn.addEventListener("click", () => {
        alert(`Hello, ${this.refs.username.value}!`);
      });
    },
  });

  RefsExample.mountTo("#refs-demo");
}
