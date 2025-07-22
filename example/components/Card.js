// example/components/Card.js

import { createComponent } from '../../lib/reactive-core.js';

export const Card = createComponent(({ props : { title, children } }) => {
  return `
    <div class="card" style="border:1px solid #ccc; padding:1rem;">
      <h3>${title}</h3>
      <slot></slot>
    </div>
  `;
});
