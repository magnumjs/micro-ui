import { WelcomeCard } from "./components/WelcomeCard.js";
import { Counter } from "./components/Counter.browser.js";
import { AuthCard } from "./components/AuthCard.js";
import { appState } from "./state.js";
import { fetchUser, loginUser, logoutUser } from "./logic.js";
import ShowHide from "./components/ShowHide.js";
import { initTodoList } from "./components/TodoList.init.js";
import { showCounterDemo, showTodoDemo } from './examples.js';
import { createComponent } from "https://unpkg.com/@magnumjs/micro-ui/dist/magnumjs-micro-ui.esm.js";
import { DocsSection } from "./components/sections/Docs.js";
import { GettingStarted } from "./components/sections/GettingStarted.js";
import { ApiSection } from "./components/sections/Api.js";
import { CreateComponentSection } from "./components/sections/CreateComponent.js";
import { CounterExampleSection } from "./components/sections/CounterExample.js";

document.addEventListener("DOMContentLoaded", () => {
  // ...existing code...
  // Render the correct section on initial load (after all setup)
  setTimeout(() => {
    const initialSection = location.hash.replace('#', '') || 'getting-started';
    showSection(initialSection);
    Prism.highlightAllUnder(document);
  }, 0);
  // Listen for hash changes to support browser navigation
  window.addEventListener('hashchange', () => {
    const section = location.hash.replace('#', '') || 'getting-started';
    showSection(section);
  });
  // Delegate navigation clicks inside content-area
  document.getElementById('content-area').addEventListener('click', (e) => {
    const link = e.target.closest('a[data-section]');
    if (link) {
      const section = link.dataset.section;
      if (section) {
        window.location.hash = `#${section}`;
        e.preventDefault();
      }
    }
  });
  // AuthCard.mount("#auth");

  // // WelcomeCard
  // // WelcomeCard
  // WelcomeCard.mount("#examples");

  // // Subscribe to state changes
  // appState.subscribe((state) => {
  //   console.log("State changed:", state);
  //   WelcomeCard.update({ user: state.user });
  //   AuthCard.update({
  //     user: state.user,
  //     onLogin: loginUser,
  //     onLogout: () => {
  //       logoutUser();
  //       console.log("Logged out! from subscription");
  //     },
  //   });
  // });

  // // Initial state
  // Counter.mount("#counter");
  // Counter.update({ count: 0 });

  // fetchUser();
  // initTodoList("#todos");

  // ShowHide.mount("#message");
  // ShowHide.update({ showMessage: true });

  // const root = document.getElementById('docs-root');

  // Top navigation (no duplicate links)
  const TopNav = createComponent(() => `
    <a href="./" style="text-decoration:none;color:inherit;">
      <h1>🧩 Micro Reactive UI Library Docs</h1>
    </a>
    <nav>
      <ul class="docs-nav">
        <li><a href="#getting-started" data-section="getting-started">Getting Started</a></li>
        <li><a href="#docs" data-section="docs">Docs</a></li>
        <li><a href="#api" data-section="api">API</a></li>
      </ul>
    </nav>
  `, {
    on: {
      "click *": (ctx) => {
        const section = ctx.event.target.dataset.section;
        if (section) {
          console.log('TopNav clicked:', section);
          window.location.hash = `#${section}`;
        }
      }
    }
  });
  // Render top nav directly as HTML to preserve horizontal layout
  TopNav.mount(document.querySelector('.docs-header'));

  // Central content area strategy: separate containers for each section
  const contentArea = document.getElementById('content-area');
  const sectionIds = ['getting-started', 'docs', 'api-createComponent', 'api', 'counter'];
  const sectionComponents = {
    'getting-started': GettingStarted,
    'docs': DocsSection,
    'api': ApiSection,
    'api-createComponent': CreateComponentSection,
    'counter': CounterExampleSection
  };
  // Create and mount each section container once
  sectionIds.forEach(id => {
    const div = document.createElement('div');
    div.id = `section-${id}`;
    div.style.display = 'none';
    contentArea.appendChild(div);
    const comp = sectionComponents[id];
    if (comp) comp.mount(div);
  });
  // Function to show/hide sections
  function renderSection(sectionId) {
    let found = false;
    sectionIds.forEach(id => {
      const div = document.getElementById(`section-${id}`);
      if (div) {
        if (id === sectionId) {
          div.style.display = '';
          found = true;
        } else {
          div.style.display = 'none';
        }
      }
    });
    // If not found, hide all and show Not Found message
    if (!found) {
      sectionIds.forEach(id => {
        const div = document.getElementById(`section-${id}`);
        if (div) div.style.display = 'none';
      });
      // Only add Not Found message if not already present
      let notFound = document.getElementById('section-not-found');
      if (!notFound) {
        notFound = document.createElement('div');
        notFound.id = 'section-not-found';
        notFound.style.padding = '2em';
        notFound.style.textAlign = 'center';
        notFound.style.color = '#888';
        notFound.textContent = 'Section not found.';
        contentArea.appendChild(notFound);
      } else {
        notFound.style.display = '';
      }
    } else {
      // Hide Not Found message if present
      const notFound = document.getElementById('section-not-found');
      if (notFound) notFound.style.display = 'none';
    }
  }
  // Sidebar navigation using micro-ui with sections
  const SidebarNav = createComponent(() => `
    <div>
      <h3>📚 Navigation</h3>
      <ul>
        <li><a href="#getting-started" data-section="getting-started">🚀 Getting Started</a></li>
      </ul>
      <hr />
      <h4>PDF Guides</h4>
      <ul>
        <li><a href="/pdf/MagnumJS_MicroUI_QuickStart.pdf" target="_blank">Quick Start PDF</a></li>
        <li><a href="/pdf/MagnumJS_MicroUI_DevGuide.pdf" target="_blank">Dev Guide PDF</a></li>
      </ul>
      <hr />
      <h4>Examples</h4>
      <ul>
        <li><a href="#counter" data-section="counter">🧮 Counter</a></li>
        <li><a href="#todo" data-section="todo">✅ TodoList</a></li>
        <li><a href="#auth-card" data-section="auth-card">🔐 AuthCard</a></li>
        <li><a href="#welcome-card" data-section="welcome-card">👋 WelcomeCard</a></li>
        <li><a href="#refs-demo" data-section="refs-demo">🔍 Refs Demo</a></li>
        <li><a href="#card-demo" data-section="card-demo">🎉 Cards Demo</a></li>
        <li><a href="#fallback-card-demo" data-section="fallback-card-demo">🧩 Fallback Cards Demo</a></li>
      </ul>
      <hr />
      <h4>API Docs</h4>
      <ul>
        <li><a href="#api-createComponent" data-section="api-createComponent">createComponent</a></li>
        <li><a href="#api-createState" data-section="api-createState">createState</a></li>
        <li><a href="#api-renderList" data-section="api-renderList">renderList</a></li>
        <li><a href="#api-shared" data-section="api-shared">shared</a></li>
      </ul>
      <hr />
      <h4>Project</h4>
      <ul>
        <li><a href="https://github.com/magnumjs/micro-ui" target="_blank">GitHub Homepage</a></li>
      </ul>
    </div>
  `, {
    on: {
      "click *": (ctx) => {
        const section = ctx.event.target.dataset.section;
        if (section) {
          console.log(section)
          window.location.hash = `#${section}`;
        }
      }
    }
  });
  // Render sidebar nav directly as HTML
  SidebarNav.mount(document.querySelector('.sidebar'));

  // Modular docs section logic
  function showSection(sectionId) {
  renderSection(sectionId);
  }

});
