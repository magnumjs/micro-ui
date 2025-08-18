import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";

const Layout = createComponent(() => `
  <div>
    <header data-slot="header">Default Header</header>
    <main><slot></slot></main>
    <footer data-slot="footer">Default Footer</footer>
  </div>
`);

Layout.mountTo('#app');
Layout.update({
  children: {
    default: "<p>Body Content</p>",
    footer: "<strong>Custom Footer</strong>",
  },
});
