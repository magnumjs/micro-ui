import { createComponent } from '../../lib/reactive-core.js';

export const LoggedIn = createComponent(({ props: {user} }) => {
  return `
    <div>
      <p>Hello, <strong>${user.name}</strong>!</p>
    </div>
  `;
});
