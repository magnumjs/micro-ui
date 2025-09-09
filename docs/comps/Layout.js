import { createComponent } from '//unpkg.com/@magnumjs/micro-ui';
import { Navbar } from './Navbar.js';
import { Sidebar } from './Sidebar.js';
import { Content } from './Content.js';
import { Footer } from './Footer.js';

export const Layout = createComponent(function ({
  props: {
    brand,
    navLinks,
    sidebarItems,
    sidebarTitle,
    sidebarClass,
    sidebarStyle,
    sidebarRenderItem,
    page,
    footerText
  },
  state,
  setState,
  refs
}) {
  return `
    <div class="d-flex flex-column vh-100">
      ${Navbar({ brand, links: navLinks })}
      <div class="container-fluid flex-grow-1">
        <div class="row h-100">
          <aside class="col-md-3 col-lg-2 bg-light border-end pt-3 ${sidebarClass || ''}" style="${sidebarStyle || ''}">
            ${Sidebar({
              items: sidebarItems
            })}
          </aside>
          <main class="col-md-9 col-lg-10">
            ${Content({ children: page })}
          </main>
        </div>
      </div>
      ${Footer({ text: footerText })}
    </div>
  `;
});