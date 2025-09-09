import { createComponent } from '//unpkg.com/@magnumjs/micro-ui';

export const Sidebar = createComponent({
  state: { open: null },
  render({ props, state }, setState) {
    const { items, title, className = '', style = '', renderItem } = props;
    const { open } = state;
    const currentHash = location.hash;
    return `
      <div class="list-group list-group-flush ${className}" style="${style}">
        ${title ? `<h5 class='mb-3'>${title}</h5>` : ''}
        ${items.map((item, idx) => {
          if (typeof renderItem === 'function') {
            return renderItem({ item, idx, open, currentHash, setState });
          }
          if (item.children && item.children.length) {
            const isOpen = open === idx;
            const parentActive = isOpen || item.href === currentHash || item.children.some(child => child.href === currentHash);
            return `
              <div>
                <a href="${item.href}" class="list-group-item list-group-item-action${parentActive ? ' active bg-light text-dark' : ''}" style="font-weight:bold;" data-parent-idx="${idx}">
                  ${item.label}
                  <span class="float-end">${isOpen ? '▼' : '▶'}</span>
                </a>
                <div class="ms-3" style="display:${isOpen ? 'block' : 'none'};">
                  ${item.children.map(child => `<a href="${child.href}" class="list-group-item list-group-item-action py-1 small${child.href === currentHash ? ' active bg-light text-dark' : ''}">${child.label}</a>`).join('')}
                </div>
              </div>
            `;
          }
          const topActive = item.href === currentHash;
          return `<a href="${item.href}" class="list-group-item list-group-item-action${topActive ? ' active bg-light text-dark' : ''}">${item.label}</a>`;
        }).join('')}
      </div>
    `;
  },
  on: {
    ['click [data-parent-idx]'](ctx) {
      const idx = Number(ctx.event.target.getAttribute('data-parent-idx'));
      this.setState({ open: idx }); // Always open the panel
      location.hash = ctx.event.target.getAttribute('href'); // Navigate to parent page
      ctx.event.preventDefault();
    }
  }
});