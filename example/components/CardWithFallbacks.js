import { createComponent } from "../lib/reactive-core.js";

export const CardWithFallbacks = createComponent(({ slots = {} }) => {
  return `
    <div class="card">
      <header>
        ${slots.header ?? "<h3>Default Header</h3>"}
      </header>
      <section>
        ${slots.default ?? "<p>Default content goes here.</p>"}
      </section>
      ${slots.footer ? `<footer>${slots.footer}</footer>` : ""}
    </div>
  `;
});
