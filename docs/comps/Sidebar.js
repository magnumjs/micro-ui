import { createComponent } from '//unpkg.com/@magnumjs/micro-ui?module';

export const Sidebar = createComponent({
  state: { open: null },
  render({ props, state }) {
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
        <a href="https://github.com/magnumjs/micro-ui" target="_blank" class="list-group-item list-group-item-action mt-4 text-primary fw-bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-github me-2" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.6-.18-3.29-.8-3.29-3.55 0-.78.28-1.42.74-1.92-.07-.18-.32-.91.07-1.89 0 0 .6-.19 1.97.73.57-.16 1.18-.24 1.79-.24.61 0 1.22.08 1.79.24 1.37-.92 1.97-.73 1.97-.73.39.98.14 1.71.07 1.89.46.5.74 1.14.74 1.92 0 2.76-1.69 3.37-3.3 3.55.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
          GitHub Project
        </a>
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