import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";

export const WelcomeCard = createComponent(({ props : { user } }) => {
  console.log(`[reactive-core] Rendering WelcomeCard with user:`, user);
  if (!user) return `<div>Loading...</div>`;
  return `
    <div class="card">
      <h1>Welcome, ${user.name}!</h1>
      <p>Email: ${user.email}</p>
    </div>
  `;
});
