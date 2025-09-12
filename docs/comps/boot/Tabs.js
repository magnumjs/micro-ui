// lib/comps/DocsTab.js
import { createComponent } from '//unpkg.com/@magnumjs/micro-ui';

export const DocsTab = createComponent({
  render({ props }) {
    const { tabs = [], active = 0 } = props;
    return `
      <ul class="nav nav-tabs mb-3" role="tablist">
        ${tabs.map((tab, i) => `
          <li class="nav-item" role="presentation">
            <button class="nav-link${i === active ? ' active' : ''}" data-bs-toggle="tab" data-bs-target="#tab${i}" type="button" role="tab">${tab.label}</button>
          </li>
        `).join('')}
      </ul>
      <div class="tab-content">
        ${tabs.map((tab, i) => `
          <div class="tab-pane fade${i === active ? ' show active' : ''}" id="tab${i}" role="tabpanel">
            ${typeof tab.content === 'function' ? tab.content() : tab.content}
          </div>
        `).join('')}
      </div>
    `;
  },
  on: {
    'click .nav-link'(ctx) {
      const idx = Array.from(ctx.event.target.parentNode.parentNode.children).indexOf(ctx.event.target.parentNode);
      ctx.setState({ active: idx });
    }
  },
  state: { active: 0 }
});


/*

//example usage:


import { DocsTab } from 'lib/comps/DocsTab.js';
import { CounterInstance } from './Counter.js'; // Your live demo
import { escapeCode } from '../../utils/escapeCode.js';

const counterSource = `...your source code here...`;

const tabs = [
  { label: 'Live Demo', content: () => CounterInstance() },
  { label: 'Source Code', content: `<pre class="bg-dark text-light p-3 rounded"><code>${escapeCode(counterSource)}</code></pre>` }
];

export const MicroUICounterDemo = DocsTab({ tabs });



// TODO: (beta version)

import { DocsTab } from '@magnumjs/micro-ui/comps/DocsTab';


const tabComponent = DocsTab({
  tabs: [
    { label: 'Tab 1', content: 'Content for Tab 1' },
    { label: 'Tab 2', content: 'Content for Tab 2' },
    { label: 'Tab 3', content: 'Content for Tab 3' },
  ]
});
// Add within your component or HTML
<div data-comp="${tabComponent}" data-props='{"tabs":[{"label":"Tab 1","content":"Content for Tab 1"},{"label":"Tab 2","content":"Content for Tab 2"},{"label":"Tab 3","content":"Content for Tab 3"}]}'></div> 




*/