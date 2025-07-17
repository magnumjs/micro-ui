import { CardWithFallbacks } from "../../components/CardWithFallbacks.js";
import { escapeCode } from "../utils/escapeCode.js";

export function renderCardWithFallbackDocs() {
  const section = document.createElement("section");
  section.id = "card-fallbacks";

  section.innerHTML = `
    <h2>🧩 CardWithFallbacks Demo</h2>

    <div class="demo-box" id="fallback-card-demo"></div>

    <div class="step">
      <h4>1. Define the Component</h4>
      <pre class="line-numbers"><code class="language-js">
${escapeCode(CardWithFallbacks.renderFn.toString())}
      </code></pre>
    </div>

    <div class="step">
      <h4>2. Update with Custom Slots</h4>
      <pre class="line-numbers"><code class="language-js">
CardWithFallbacks.update({
  slots: {
    header: "&lt;h1&gt;Custom Header&lt;/h1&gt;",
    default: "&lt;p&gt;Custom Body&lt;/p&gt;",
    footer: "&lt;button&gt;Close&lt;/button&gt;"
  }
});
      </code></pre>
    </div>

    <div class="step">
      <h4>2 (b). Want Just Header and Fallback Body?</h4>
      <pre class="line-numbers"><code class="language-js">
CardWithFallbacks.update({
  slots: {
    header: "&lt;h1&gt;Custom Header&lt;/h1&gt;",
    // default: omitted
    // footer: omitted
  }
});
      </code></pre>
    </div>
  `;

  document.getElementById("docs-root").appendChild(section);

  CardWithFallbacks.mountTo("#fallback-card-demo");
  CardWithFallbacks.update({
    slots: {
      header: "<h1>🪄 Hello from Slot</h1>",
      default: "<p>This body is dynamic via slot.</p>",
      footer: "<button>Okay</button>",
    },
  });
}
