// GridContainer.js
// Reusable Bootstrap grid container with dynamic columns and customization
import { createComponent } from "//unpkg.com/@magnumjs/micro-ui?module";

// Props: containerClass, rowClass, columns: [{ className, content }]
export const GridContainer = createComponent({
  props: {
    containerClass: "container py-5",
    rowClass: "row",
    columns: []
  },
  render({ props: {containerClass, rowClass, columns } }) {
    return `<div class='${containerClass}'>
      <div class='${rowClass}'>
        ${columns.map(col => `<div class='${col.className || "col"}'>${col.content}</div>`).join("")}
      </div>
    </div>`;
  }
});
