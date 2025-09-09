import { createComponent } from '//unpkg.com/@magnumjs/micro-ui?module';

export const Footer = createComponent(function ({ props: { text }  }) {
  return  `
    <footer class="bg-light text-center py-3 mt-auto border-top">
      <small>${text || `© ${new Date().getFullYear()} MicroUI`}</small>
    </footer>
  `;
});