// example/components/Card.js

import { createComponent } from '../../lib/reactive-core.js';

export const Card = createComponent(
  ({ title = '', children = '' }) => `
    <div class="card">
      <div class="card-header">
        <h3>${title}</h3>
      </div>
      <div class="card-body">
        ${Array.isArray(children) ? children.join('') : children}
      </div>
    </div>
  `,
  {
    // Optional: Add event delegation if needed for card-level events
    events: {},
  }
);
