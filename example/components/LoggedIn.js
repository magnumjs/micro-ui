import { createComponent } from '../../lib/reactive-core.js';

export const LoggedIn = createComponent(
  ({ user }) => `
    <div key="${user?.id || 'guest'}">
      <p>Hello, ${user?.name}</p>
      <button id="logout">Logout</button>
    </div>
  `,
  {
    events: {
      'click #logout': function () {
        this.props.onLogout?.();
      },
    },
  }
);

