import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";

export const LoggedIn = createComponent(({ props: {user} }) => {
  return `
    <div>
      <p>Hello, <strong>${user.name}</strong>!</p>
    </div>
  `;
});
