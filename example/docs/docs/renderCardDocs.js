import Card from "../../components/NamedSlotsCard.js";
import { escapeCode } from "../utils/escapeCode.js";

export function renderCardDocs() {
  const section = document.createElement("section");
  section.id = "card-component";

  section.innerHTML = `
    <h2>🧩 Card Component with Named Slots</h2>

    <div class="demo-box" id="card-demo"></div>

    <div class="step">
      <h4>1. Define the Component with Named Slots</h4>
      <pre class="line-numbers"><code class="language-js">
${escapeCode(Card.renderFn.toString())}
      </code></pre>
    </div>

    <div class="step">
      <h4>2. Use the Card with Default and Named Slots</h4>
      <pre class="line-numbers"><code class="language-js">
Card.mountTo('#card-demo');

Card.update({
  title: "Hello Slots",
  slots: {
    default: "&lt;p&gt;This is the main content inside the card.&lt;/p&gt;",
    footer: "&lt;small&gt;Created with &lt;3&lt;/small&gt;"
  }
});
      </code></pre>
    </div>
  `;

  document.getElementById("docs-root").appendChild(section);

  // Live Demo
  Card.mountTo("#card-demo");
  Card.update({
    title: "Hello Slots",
    slots: {
      default: "<p>This is the main content inside the card.</p>",
      footer: "<small>Created with ❤️</small>",
    },
  });
}
