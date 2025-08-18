import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";

export const Message = createComponent(({ props:{visible} }) => {
  return visible ? `<p id="message">You can see me!</p>` : null;
});
