import { createComponent } from '/lib/reactive-core.js';

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
