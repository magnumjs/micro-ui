import { createComponent } from '../../lib/reactive-core.js';
import { Card } from './Card.js';
import { LoginForm } from './LoginForm.js';
import { LoggedIn } from './LoggedIn.js';

export const AuthCard = createComponent(({ user, onLogin, onLogout }) => {
  const children = user
    ? `
      ${LoggedIn.render({ user, onLogout })}
      <button id="logout" style="margin-top: 1rem;">Log Out</button>
    `
    : LoginForm.render();

  return Card.render({
    title: user ? 'Welcome Back' : 'Please Log In',
    children,
  });
},
  {
    events: {
      'click #logout': function (e) {
        // Call onLogout callback passed via props
        this.props.onLogout?.();
      },
      // Optionally delegate login events here too if LoginForm's buttons are inside children
      'submit #login-form': function (e) {
        e.preventDefault();
        const usernameInput = this.el.querySelector('#username');
        if (usernameInput?.value) {
          this.props.onLogin?.(usernameInput.value);
        }
      },
    },
  }
);
