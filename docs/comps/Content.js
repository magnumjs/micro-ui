import { createComponent } from '//unpkg.com/@magnumjs/micro-ui';

export const Content = createComponent(function ({ props: { children } }) {
  return `
    <div class="p-4">
       ${children?._id ? `<div data-comp="${children?._id}"></div>`: children ? children : "<h2>Welcome</h2><p>No content provided.</p>"}
      </div>
    </div>
  `;
});