import { createComponent } from '@magnumjs/micro-ui';
// example/components/NamedSlotsCard.js
const NamedSlotsCard = createComponent(({ props : {title, slots = {}, children } }) => `
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
