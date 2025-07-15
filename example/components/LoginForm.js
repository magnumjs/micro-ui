import { createComponent } from '../../lib/reactive-core.js';

export const LoginForm = createComponent(() => {
  return `
    <form id="login-form" style="display:flex;flex-direction:column;gap:0.5rem;">
      <input id="username" type="text" placeholder="Username" />
      <input id="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  `;
});
