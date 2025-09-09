import { createComponent } from '//unpkg.com/@magnumjs/micro-ui?module';

export const Navbar = createComponent(function ({ props: { brand, links = [] } }) {
  return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">${brand || "MicroUI"}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div id="navbarNav" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto">
            ${links.map(
              link => {
                const active = location.hash === link.href ? ' active' : '';
                return `<li class="nav-item">
                  <a class="nav-link${active ? ' bg-light text-dark' : ''}" href="${link.href}">${link.label}</a>
                </li>`;
              }
            ).join('')}
          </ul>
        </div>
      </div>
    </nav>
  `;
});