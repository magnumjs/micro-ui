import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";

export const CardWithFallbacks = createComponent(({ props : {slots = {} } }) => {
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
