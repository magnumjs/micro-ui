// TabbedContent.js
// Reusable Bootstrap tabbed content component for docs
// Usage: TabbedContent({ tabs: [{label, id, content}], activeId })

import { createComponent } from "//unpkg.com/@magnumjs/micro-ui?module";

export const TabbedContent = createComponent({
  props: {
    tabs: [],
    activeId: null
  },
  render({ props: { tabs, activeId } }) {
    const tabId = 'tab-' + Math.random().toString(36).slice(2, 8);
    const active = activeId || (tabs[0] && tabs[0].id);
    return `
      <ul class="nav nav-tabs" id="${tabId}" role="tablist">
        ${tabs.map(tab => `
          <li class="nav-item" role="presentation">
            <button class="nav-link${tab.id === active ? ' active' : ''}" id="${tab.id}-tab" data-bs-toggle="tab" data-bs-target="#${tab.id}" type="button" role="tab" aria-controls="${tab.id}" aria-selected="${tab.id === active}">${tab.label}</button>
          </li>
        `).join('')}
      </ul>
      <div class="tab-content" id="${tabId}Content">
        ${tabs.map(tab => `
          <div class="tab-pane fade${tab.id === active ? ' show active' : ''}" id="${tab.id}" role="tabpanel" aria-labelledby="${tab.id}-tab">
            ${tab.content}
          </div>
        `).join('')}
      </div>
    `;
  }
});
