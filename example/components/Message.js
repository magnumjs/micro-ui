import { createComponent } from "../lib/reactive-core.js";

export const Message = createComponent(({ props:{visible} }) => {
  return visible ? `<p id="message">You can see me!</p>` : null;
});
