import { WelcomeCard } from "./components/WelcomeCard.js";
import { Counter } from "./components/Counter.browser.js";
import { AuthCard } from "./components/AuthCard.js";
import { appState } from "./state.js";
import { fetchUser, loginUser, logoutUser } from "./logic.js";
import ShowHide from "./components/ShowHide.js";
import { initTodoList } from "./components/TodoList.init.js";
import { showCounterDemo, showTodoDemo } from './examples.js';

document.addEventListener("DOMContentLoaded", () => {
  AuthCard.mount("#auth");

  // WelcomeCard
  // WelcomeCard
  WelcomeCard.mount("#examples");

  // Subscribe to state changes
  appState.subscribe((state) => {
    console.log("State changed:", state);
    WelcomeCard.update({ user: state.user });
    AuthCard.update({
      user: state.user,
      onLogin: loginUser,
      onLogout: () => {
        logoutUser();
        console.log("Logged out! from subscription");
      },
    });
  });

  // Initial state
  Counter.mount("#counter");
  Counter.update({ count: 0 });

  fetchUser();
  initTodoList("#todos");

  ShowHide.mount("#message");
  ShowHide.update({ showMessage: true });

  const root = document.getElementById('docs-root');
  // Example navigation
  document.getElementById('nav-counter')?.addEventListener('click', (e) => {
    e.preventDefault();
    showCounterDemo(root);
  });
  document.getElementById('nav-todo')?.addEventListener('click', (e) => {
    e.preventDefault();
    showTodoDemo(root);
  });
  // Docs/API navigation
  function showSection(sectionId) {
    const sections = ['getting-started', 'docs', 'api'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = (id === sectionId) ? '' : 'none';
    });
  }
  document.getElementById('nav-docs')?.addEventListener('click', (e) => {
    e.preventDefault();
    showSection('docs');
  });
  document.getElementById('nav-api')?.addEventListener('click', (e) => {
    e.preventDefault();
    showSection('api');
  });
  // Show docs by default if hash is #docs or #api
  if (location.hash === '#docs') showSection('docs');
  else if (location.hash === '#api') showSection('api');
  else showSection('getting-started');
});
