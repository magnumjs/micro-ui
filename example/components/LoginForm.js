// Path: micro-ui/example/components/LoginForm.js
import { createComponent } from '../../lib/reactive-core.js';

export const LoginForm = createComponent(
  () => `
    <form id="login-form">
      <input type="text" id="username" placeholder="Enter your name" required />
      <button type="submit">Log In</button>
    </form>
  `,
  {
    events: {
      'submit #login-form': function (e) {
        e.preventDefault();
        const name = e.target.querySelector('#username')?.value;
        if (name) {
          this.props.onLogin?.(name);
        }
      },
    },
  }
);
