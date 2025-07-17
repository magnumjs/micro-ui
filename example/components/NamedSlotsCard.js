import { createComponent } from '../../lib/reactive-core.js';
// example/components/NamedSlotsCard.js
const NamedSlotsCard = createComponent(({ title, slots = {}, children }) => `
  <div class="card">
    <h3>${title}</h3>
    <div class="body">
      <slot></slot> <!-- default -->
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
`);

export default NamedSlotsCard
